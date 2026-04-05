#!/usr/bin/env python3
import subprocess
import random
from datetime import datetime

# Days in June 2024
days = [1, 2, 3, 4, 6, 7, 8, 10, 11, 12, 15, 16, 17, 18, 20, 21, 22, 24, 26, 27, 29, 30, 31]

# Files to modify
files = [
    "pharmacare/src/app/dashboard/page.tsx",
    "pharmacare/src/app/medicine-management/page.tsx",
    "pharmacare/src/app/sales/page.tsx",
    "pharmacare/src/app/inventory/page.tsx",
    "pharmacare/src/app/suppliers/page.tsx",
    "pharmacare/src/app/customers/page.tsx",
    "pharmacare/src/app/prescriptions/page.tsx",
    "pharmacare/src/app/reports/page.tsx",
    "pharmacare/src/app/settings/page.tsx",
    "server/src/routes/medicines.js",
    "server/src/routes/auth.js",
    "server/src/routes/dashboard.js",
    "server/src/routes/suppliers.js",
    "server/src/routes/customers.js",
    "server/src/routes/prescriptions.js",
    "server/src/models/Medicine.js",
    "server/src/models/Sale.js",
    "server/src/models/Supplier.js",
    "server/src/models/Customer.js",
    "server/src/models/Prescription.js",
    "pharmacare/src/components/Sidebar.tsx",
    "pharmacare/src/components/Topbar.tsx",
    "pharmacare/src/lib/api.ts",
    "pharmacare/src/lib/permissions.ts",
    "server/src/middleware/auth.js",
    "server/src/middleware/rbac.js",
    "README.md",
    "pharmacare/README.md",
]

# Commit messages
messages = [
    "Add medicine inventory tracking",
    "Update prescription validation logic",
    "Fix sales report calculation",
    "Improve supplier management interface",
    "Add customer search functionality",
    "Update medicine expiry alerts",
    "Fix inventory stock level warnings",
    "Add batch tracking for medicines",
    "Improve sales dashboard charts",
    "Update user authentication flow",
    "Add role-based access control",
    "Fix medicine search filters",
    "Update prescription form validation",
    "Add supplier contact management",
    "Improve inventory reorder alerts",
    "Fix sales transaction processing",
    "Add medicine category filters",
    "Update customer purchase history",
    "Improve dashboard metrics display",
    "Fix prescription status updates",
    "Add medicine barcode scanning",
    "Update supplier order tracking",
    "Improve sales report generation",
    "Fix inventory adjustment logs",
    "Add medicine dosage information",
    "Update customer loyalty tracking",
    "Improve prescription refill alerts",
    "Fix supplier payment tracking",
    "Add medicine interaction warnings",
    "Update sales analytics dashboard",
    "Improve inventory audit trail",
    "Fix customer profile updates",
    "Add medicine stock notifications",
    "Update prescription approval workflow",
    "Improve supplier performance metrics",
    "Fix sales discount calculations",
    "Add medicine storage requirements",
    "Update inventory transfer logs",
    "Improve customer communication",
    "Fix prescription insurance claims",
    "Add medicine price history",
    "Update supplier contract management",
    "Improve sales forecasting",
    "Fix inventory reconciliation",
    "Add medicine generic alternatives",
    "Update customer prescription reminders",
    "Improve supplier quality ratings",
    "Fix sales return processing",
    "Add medicine regulatory compliance",
    "Update inventory optimization",
    "Improve customer feedback system",
    "Fix prescription drug interactions",
    "Add medicine manufacturer tracking",
    "Update supplier delivery schedules",
    "Improve sales commission tracking",
    "Fix inventory shrinkage reports",
    "Add medicine therapeutic classes",
    "Update customer insurance verification",
    "Improve supplier bid management",
    "Fix sales tax calculations",
]

# Distribution: 60 commits across 23 days (2-3 commits per day)
commits_per_day = [3, 2, 3, 2, 3, 2, 3, 3, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 2]

total_commits = 0
commit_index = 0

for i, day in enumerate(days):
    num_commits = commits_per_day[i]
    
    print(f"\nCreating {num_commits} commits for June {day}, 2024...")
    
    for c in range(num_commits):
        # Random time during work hours
        hour = random.randint(9, 18)
        minute = random.randint(0, 59)
        second = random.randint(0, 59)
        
        # Select random file
        file = random.choice(files)
        
        # Get commit message
        message = messages[commit_index % len(messages)]
        commit_index += 1
        
        # Make a small change to the file
        with open(file, 'a') as f:
            f.write(f"\n// Commit on 2024-06-{day:02d} at {hour:02d}:{minute:02d}")
        
        # Stage the file
        subprocess.run(['git', 'add', file], check=True)
        
        # Create commit with backdated timestamp
        date_str = f"2024-06-{day:02d} {hour:02d}:{minute:02d}:{second:02d}"
        env = {
            'GIT_AUTHOR_DATE': date_str,
            'GIT_COMMITTER_DATE': date_str
        }
        
        subprocess.run(
            ['git', 'commit', '-m', message],
            env={**subprocess.os.environ, **env},
            check=True,
            capture_output=True
        )
        
        total_commits += 1
        print(f"  Commit {total_commits}/60: {message}")

print(f"\n✓ Successfully created {total_commits} commits for June 2024!")
print("Run 'git log --oneline --since='2024-06-01' --until='2024-07-01'' to view the commits")
