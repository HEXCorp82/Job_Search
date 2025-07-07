// Load and display jobs
async function loadJobs() {
    try {
        const response = await fetch('data/jobs.json');
        const jobs = await response.json();
        
        document.getElementById('last-updated').textContent = `Last updated: ${new Date().toLocaleString()}`;
        renderJobs(jobs);
        setupFilters(jobs);
    } catch (error) {
        console.error("Error loading jobs:", error);
    }
}

// Render jobs to the page
function renderJobs(jobs, filter = 'all') {
    const container = document.getElementById('job-list');
    container.innerHTML = '';
    
    jobs.filter(job => filter === 'all' || job.category?.toLowerCase() === filter).forEach(job => {
        container.innerHTML += `
        <div class="col-md-6 mb-4 job-card">
            <div class="card h-100">
                <div class="card-body">
                    <h5 class="card-title">${job.title}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">${job.company} • ${job.location}</h6>
                    <div class="mb-2">
                        ${job.category ? `<span class="badge bg-primary me-1">${job.category}</span>` : ''}
                        ${job.skills?.map(skill => `<span class="badge bg-secondary me-1">${skill}</span>`).join('') || ''}
                    </div>
                    <a href="${job.url}" class="btn btn-success" target="_blank">Apply</a>
                </div>
                <div class="card-footer text-muted">
                    ${job.date}
                </div>
            </div>
        </div>`;
    });
}

// Set up search and filters
function setupFilters(jobs) {
    // Search functionality
    document.getElementById('search').addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        document.querySelectorAll('.job-card').forEach(card => {
            card.style.display = card.textContent.toLowerCase().includes(term) ? 'block' : 'none';
        });
    });
    
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderJobs(jobs, btn.dataset.filter);
        });
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', loadJobs);

