async function loadMindMap() {
    const response = await fetch('data/mindmap.json');
    const mindmapData = await response.json();
    const options = {
        container: 'mindmap',
        editable: false,
        theme: 'primary',
        view: { lineWidth: 2, lineColor: '#007bff' }
    };
    const jm = new jsMind(options);
    jm.show(mindmapData);

    document.getElementById('mindmap').onclick = function() {
        const node = jm.get_selected_node();
        if (node && node.id !== 'root') {
            showJobsForBranch(node.topic);
        }
    };
}

function showJobsForBranch(branch) {
    fetch('data/jobs.json')
      .then(res => res.json())
      .then(jobs => {
        const filtered = jobs.filter(j => (j.category || "Other") === branch);
        filtered.sort((a, b) => new Date(a.deadline || 0) - new Date(b.deadline || 0));
        renderJobs(filtered);
      });
}

document.addEventListener('DOMContentLoaded', loadMindMap);

