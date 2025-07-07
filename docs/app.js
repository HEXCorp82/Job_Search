// Load and display jobs
async function loadJobs() {
    try {
        const response = await fetch('data/jobs.json');
        const jobs = await response.json();
        document.getElementById('last-updated').textContent = `Last updated: ${new Date().toLocaleString()}`;
        renderJobs(jobs);
    } catch (error) {
        console.error("Error loading jobs:", error);
    }
}

// Render jobs to the page
function renderJobs(jobs) {
    const container = document.getElementById('job-list');
    container.innerHTML = '';
    jobs.forEach(job => {
        container.innerHTML += `
        <div class="col-md-6 mb-4 job-card">
            <div class="card h-100">
                <div class="card-body">
                    <h5 class="card-title">${job.title}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">${job.company} • ${job.location}</h6>
                    <div class="mb-2">
                        ${job.category ? `<span class="badge bg-primary me-1">${job.category}</span>` : ''}
                    </div>
                    <a href="${job.url}" class="btn btn-success" target="_blank">Apply</a>
                </div>
                <div class="card-footer text-muted">
                    ${job.date}${job.deadline ? ` • Deadline: ${job.deadline}` : ''}
                </div>
            </div>
        </div>`;
    });
}

document.addEventListener('DOMContentLoaded', loadJobs);
