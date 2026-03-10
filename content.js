
// Free Learning Resources
const FREE_RESOURCES = [
    {
        "id": 2,
        "title": "What is UiPath?",
        "link": "https://drive.google.com/file/d/1J2FYk-9T_pmtrVcJ_M4HHzaxGSMrjpDL/view?usp=drive_link",
        "desc": "Introduction to the leading RPA platform...."
    },
    {
        "id": 1,
        "title": "Types of Automation",
        "link": "https://drive.google.com/file/d/1Z0p3fgyrewvt5EcWoV6tf29qCa2b5W2s/view?usp=sharing",
        "desc": "Understanding attended vs unattended BOTs."
    },
    {
        "id": 3,
        "title": "Asset",
        "link": "https://drive.google.com/file/d/1ahtrApEPIsLA_tSVWFN3LhTaLLE7WIao/view?usp=sharing",
        "desc": "How to manage variables in Orchestrator."
    },
    {
        "id": 4,
        "title": "Triggers",
        "link": "https://drive.google.com/file/d/1bMYKpPteVxm1fMoZahdipKkbiUIJhcuu/view?usp=sharing",
        "desc": "Scheduling and event-based execution."
    },
    {
        "id": 5,
        "title": "Queues",
        "link": "https://drive.google.com/file/d/18EgMUvmmSle5y5ON8N6WC2HDGFaE6NfQ/view?usp=sharing",
        "desc": "Handling transaction-based processing."
    },
    {
        "id": 6,
        "title": "Process & Jobs",
        "link": "https://drive.google.com/file/d/1Ut1_TK6n7qNFVFPS4mroGRZqRfPXX8pR/view?usp=sharing",
        "desc": "Deployment and execution management."
    },
    {
        "id": 7,
        "title": "Healing Agent",
        "link": "https://drive.google.com/file/d/1oDmYY_4YcEsXsBBdxGRB-QNkz02nZDhS/view?usp=drive_link",
        "desc": "Self-healing mechanisms in automation."
    },
    {
        "id": 8,
        "title": "High Density Robots",
        "link": "https://drive.google.com/file/d/1LEe79Rr-h0Uh4u9dW0iIsim3jthM3RaB/view?usp=sharing",
        "desc": "Maximizing server utilization with HD robots."
    },
    {
        "id": 9,
        "title": "Logging",
        "link": "https://drive.google.com/file/d/1KmXHZh1m4wuk8LszKnKX8RgYXuE96Yfd/view?usp=sharing",
        "desc": "Advanced debugging and audit trails."
    },
    {
        "id": 10,
        "title": "Cloud Robots",
        "link": "https://drive.google.com/file/d/1McbiAZCq82xVlkiVJnsHzj3JhDyw_u6U/view?usp=sharing",
        "desc": "Serverless execution in the cloud."
    },
    {
        "id": 23,
        "title": "Dependencies",
        "link": "https://drive.google.com/file/d/1_lYu91uqUDIYHzXtoWXXp2ikCy0Fq00L/view?usp=sharing",
        "desc": "Managing NuGet packages and versions."
    }
];

// Exclusive Community Resources
const EXCLUSIVE_RESOURCES = [
    {
        "id": 22,
        "title": "RE-Framework",
        "link": "https://drive.google.com/file/d/1gCFzjseCnuZkik7R2kJYfLWnuHPSG2Ta/view?usp=sharing",
        "desc": "The gold standard for enterprise automation."
    },
    {
        "id": 24,
        "title": "Excel & Workbook Activities",
        "link": "https://drive.google.com/file/d/1yUe6N4pK0sOlGtvJby1YZMc3AI8VQs3A/view?usp=sharing",
        "desc": "High-performance data manipulation."
    },
    {
        "id": 25,
        "title": "Excel & Workbook Activities",
        "link": "https://drive.google.com/file/d/1yUe6N4pK0sOlGtvJby1YZMc3AI8VQs3A/view?usp=sharing",
        "desc": "High-performance data manipulation."
    }
];

// Combined for easy lookup
const ALL_RESOURCES = [...FREE_RESOURCES, ...EXCLUSIVE_RESOURCES.map(r => ({ ...r, exclusive: true }))];

const youtubeVideos = [
    {
        "title": "50+ UiPath RPA Interview Questions",
        "id": "dQw4w9WgXcQ",
        "thumbnail": "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
        "views": "1.2K",
        "duration": "45:20",
        "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    },
    {
        "title": "RE-Framework Pro Tips",
        "id": "dQw4w9WgXcQ",
        "thumbnail": "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
        "views": "3K",
        "duration": "12:15",
        "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    },
    {
        "title": "Orchestrator Mastery 2026",
        "id": "dQw4w9WgXcQ",
        "thumbnail": "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
        "views": "800",
        "duration": "25:00",
        "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    },
    {
        "title": "Cloud Robots Walkthrough",
        "id": "dQw4w9WgXcQ",
        "thumbnail": "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
        "views": "2.5K",
        "duration": "18:40",
        "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    },
    {
        "title": "AI Center Integration",
        "id": "dQw4w9WgXcQ",
        "thumbnail": "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
        "views": "1.1K",
        "duration": "22:10",
        "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    },
    {
        "title": "Self-Healing Automation",
        "id": "dQw4w9WgXcQ",
        "thumbnail": "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
        "views": "4K",
        "duration": "14:55",
        "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    }
];
