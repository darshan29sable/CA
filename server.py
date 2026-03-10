import json
import re
import base64
from http.server import SimpleHTTPRequestHandler, HTTPServer
import os

PORT = 8000
CONFIG_PATH = os.path.join(os.path.dirname(__file__), 'config.js')

class ConfigUpdateHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

    def do_GET(self):
        if self.path == '/config.js':
            try:
                with open(CONFIG_PATH, 'r', encoding='utf-8') as f:
                    content = f.read()
                # Securely strip ALL passwords before sending to the browser so the config is safe!
                redacted_content = re.sub(r'password\s*:\s*".*?"\s*,?\s*', '', content)
                self.send_response(200)
                self.send_header('Content-Type', 'application/javascript')
                self.end_headers()
                self.wfile.write(redacted_content.encode('utf-8'))
                return
            except Exception as e:
                self.send_response(500)
                self.end_headers()
                return

        super().do_GET()

    def update_config(self, updater_func):
        try:
            with open(CONFIG_PATH, 'r', encoding='utf-8') as file:
                content = file.read()
            
            # Extract the raw JSON-like string from the JS file
            match = re.search(r'const\s+CONFIG\s*=\s*(\{.*?\});?', content, re.DOTALL)
            if not match:
                return False, "Could not locate CONFIG object."
                
            raw_obj = match.group(1)
            
            # VERY basic conversion of unquoted JS keys to JSON string keys so python can parse it safely
            json_str = re.sub(r'(\w+):', r'"\1":', raw_obj)
            # Remove trailing commas that JS allows but strict JSON does not
            json_str = re.sub(r',\s*}', '}', json_str)
            json_str = re.sub(r',\s*]', ']', json_str)
            
            config_data = json.loads(json_str)
            
            # Apply our updates
            updater_func(config_data)
            
            # Convert back to JSON text
            new_obj_str = json.dumps(config_data, indent=4)
            # Write exactly back over the match
            new_content = content.replace(raw_obj, new_obj_str)
            
            with open(CONFIG_PATH, 'w', encoding='utf-8') as file:
                file.write(new_content)
                
            return True, "Success"
        except Exception as e:
            return False, str(e)

    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_length).decode('utf-8')
        
        try:
            data = json.loads(body)
            
            if self.path == '/api/login':
                username = data.get('username', '').lower()
                password = data.get('password', '')
                
                try:
                    with open(CONFIG_PATH, 'r', encoding='utf-8') as file:
                        content = file.read()
                    match = re.search(r'const\s+CONFIG\s*=\s*(\{.*?\});?', content, re.DOTALL)
                    if not match:
                        raise Exception("Config object not found")
                        
                    raw_obj = match.group(1)
                    json_str = re.sub(r'(\w+):', r'"\1":', raw_obj)
                    json_str = re.sub(r',\s*}', '}', json_str)
                    json_str = re.sub(r',\s*]', ']', json_str)
                    config_data = json.loads(json_str)

                    is_valid = False
                    for user in config_data.get('users', []):
                        if str(user.get('username', '')).lower() == username:
                            stored_pass = user.get('password', '')
                            # Allow dynamic reset check (mirroring the JS local storage logic)
                            decoded_pass = base64.b64decode(stored_pass).decode('utf-8')
                            if decoded_pass == password:
                                is_valid = True
                                break
                    
                    self.send_response(200)
                    self.send_header('Content-Type', 'application/json')
                    self.end_headers()
                    self.wfile.write(json.dumps({'success': is_valid}).encode('utf-8'))
                    return
                except Exception as e:
                    self.send_response(500)
                    self.send_header('Content-Type', 'application/json')
                    self.end_headers()
                    self.wfile.write(json.dumps({'success': False, 'message': str(e)}).encode('utf-8'))
                    return

            elif self.path == '/api/update-password':
                username = data.get('username', '').lower()
                new_password = data.get('newPasswordBase64')
                
                def password_updater(config):
                    for user in config.get('users', []):
                        if str(user.get('username', '')).lower() == username:
                            user['password'] = new_password
                            
                success, msg = self.update_config(password_updater)
                
                self.send_response(200 if success else 500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'success': success, 'message': msg}).encode('utf-8'))
                return

            elif self.path == '/api/update-score':
                username = data.get('username', '').lower()
                test_id = data.get('testId')
                score = data.get('score')
                
                def score_updater(config):
                    for user in config.get('users', []):
                        if str(user.get('username', '')).lower() == username:
                            if 'scores' not in user:
                                user['scores'] = {}
                            user['scores'][test_id] = score
                            
                success, msg = self.update_config(score_updater)
                
                self.send_response(200 if success else 500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'success': success, 'message': msg}).encode('utf-8'))
                return
                
        except json.JSONDecodeError:
            self.send_response(400)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'success': False, 'message': 'Invalid JSON'}).encode('utf-8'))
            return

        # Fallback for unhandled POSTs
        self.send_response(404)
        self.end_headers()

if __name__ == '__main__':
    server_address = ('', PORT)
    httpd = HTTPServer(server_address, ConfigUpdateHandler)
    print(f"\n==========================================")
    print(f" Python Backend Server Started Successfully!")
    print(f" Live at: http://localhost:{PORT}")
    print(f"==========================================\n")
    httpd.serve_forever()
