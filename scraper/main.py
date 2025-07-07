from playwright.sync_api import sync_playwright
import json
from datetime import datetime

def scrape_jobs():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.goto("https://www.linkedin.com/jobs/search/?keywords=Metallurgy%20Materials%20Engineering&f_TPR=r86400")
        
        jobs = []
        for listing in page.locator(".jobs-search__results-list li").all()[:10]:  # Limit to 10 jobs
            jobs.append({
                "title": listing.locator(".base-search-card__title").inner_text(),
                "company": listing.locator(".base-search-card__subtitle").inner_text(),
                "location": listing.locator(".job-search-card__location").inner_text(),
                "date": datetime.now().strftime("%Y-%m-%d"),
                "url": listing.locator("a.base-card__full-link").get_attribute("href")
            })
        
        with open("../data/jobs.json", "w") as f:
            json.dump(jobs, f, indent=2)
        browser.close()

if __name__ == "__main__":
    scrape_jobs()
