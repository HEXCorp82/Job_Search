from playwright.sync_api import sync_playwright
import json
from datetime import datetime
import collections

def scrape_jobs():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.goto("https://www.linkedin.com/jobs/search/?keywords=Metallurgy%20Materials%20Engineering&f_TPR=r86400")
        
        jobs = []
        for listing in page.locator(".jobs-search__results-list li").all()[:10]:
            jobs.append({
                "title": listing.locator(".base-search-card__title").inner_text(),
                "company": listing.locator(".base-search-card__subtitle").inner_text(),
                "location": listing.locator(".job-search-card__location").inner_text(),
                "date": datetime.now().strftime("%Y-%m-%d"),
                "url": listing.locator("a.base-card__full-link").get_attribute("href"),
                "category": "Industry",  # You can use logic to set category based on title/company
                "deadline": ""           # Scrape or set deadline if available
            })
        
        with open("../data/jobs.json", "w") as f:
            json.dump(jobs, f, indent=2)
        browser.close()
    build_mindmap(jobs)

def build_mindmap(jobs):
    mindmap = {
        "meta": {"name": "Job Opportunities", "author": "Auto"},
        "format": "node_array",
        "data": []
    }
    # Seed branches
    branches = collections.defaultdict(list)
    for job in jobs:
        branch = job.get("category", "Other")
        branches[branch].append(job)
    mindmap['data'].append({"id": "root", "isroot": True, "topic": "Job Opportunities"})
    for branch, jobs_in_branch in branches.items():
        branch_id = branch.lower().replace(" ", "-")
        mindmap['data'].append({"id": branch_id, "parentid": "root", "topic": branch})
        for job in jobs_in_branch:
            mindmap['data'].append({
                "id": job["title"].replace(" ", "-") + job["company"].replace(" ", "-"),
                "parentid": branch_id,
                "topic": job["title"],
                "url": job["url"],
                "deadline": job.get("deadline", "")
            })
    with open("../data/mindmap.json", "w") as f:
        json.dump(mindmap, f, indent=2)

if __name__ == "__main__":
    scrape_jobs()
