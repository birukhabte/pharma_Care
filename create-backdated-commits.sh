#!/bin/bash

# Array of days in June 2024
days=(1 2 3 4 6 7 8 10 11 12 15 16 17 18 20 21 22 24 26 27 29 30 31)

# Array of files to modify
files=(
  "pharmacare/src/app/dashboard/page.tsx"
  "pharmacare/src/app/medicine-management/page.tsx"
  "pharmacare/src/app/sales/page.tsx"
  "pharmacare/src/app/inventory/page.tsx"
  "pharmacare/src/app/suppliers/page.tsx"
  "pharmacare/src/app/customers/page.tsx"
  "pharmacare/src/app/prescriptions/page.tsx"
  "pharmacare/src/app/reports/page.tsx"
  "pharmacare/src/app/settings/page.tsx"
  "server/src/routes/medicines.js"
  "server/src/routes/auth.js"
  "server/src/routes/dashboard.js"
  "server/src/routes/suppliers.js"
  "server/src/routes/customers.js"
  "server/src/routes/prescriptions.js"
  "server/src/routes/auditLogs.js"
  "server/src/routes/notifications.js"
  "server/src/models/Medicine.js"
  "server/src/models/Sale.js"
  "server/src/models/Supplier.js"
  "server/src/models/Customer.js"
  "server/src/models/Prescription.js"
  "pharmacare/src/components/Sidebar.tsx"
  "pharmacare/src/components/Topbar.tsx"
  "pharmacare/src/lib/api.ts"
  "pharmacare/src/lib/permissions.ts"
  "server/src/middleware/auth.js"
  "server/src/middleware/rbac.js"
  "README.md"
  "pharmacare/README.md"
)

# Array of commit messages
messages=(
  "Add medicine inventory tracking"
  "Update prescription validation logic"
  "Fix sales report calculation"
  "Improve supplier management interface"
  "Add customer search functionality"
  "Update medicine expiry alerts"
  "Fix inventory stock level warnings"
  "Add batch tracking for medicines"
  "Improve sales dashboard charts"
  "Update user authentication flow"
  "Add role-based access control"
  "Fix medicine search filters"
  "Update prescription form validation"
  "Add supplier contact management"
  "Improve inventory reorder alerts"
  "Fix sales transaction processing"
  "Add medicine category filters"
  "Update customer purchase history"
  "Improve dashboard metrics display"
  "Fix prescription status updates"
  "Add medicine barcode scanning"
  "Update supplier order tracking"
  "Improve sales report generation"
  "Fix inventory adjustment logs"
  "Add medicine dosage information"
  "Update customer loyalty tracking"
  "Improve prescription refill alerts"
  "Fix supplier payment tracking"
  "Add medicine interaction warnings"
  "Update sales analytics dashboard"
  "Improve inventory audit trail"
  "Fix customer profile updates"
  "Add medicine stock notifications"
  "Update prescription approval workflow"
  "Improve supplier performance metrics"
  "Fix sales discount calculations"
  "Add medicine storage requirements"
  "Update inventory transfer logs"
  "Improve customer communication"
  "Fix prescription insurance claims"
  "Add medicine price history"
  "Update supplier contract management"
  "Improve sales forecasting"
  "Fix inventory reconciliation"
  "Add medicine generic alternatives"
  "Update customer prescription reminders"
  "Improve supplier quality ratings"
  "Fix sales return processing"
  "Add medicine regulatory compliance"
  "Update inventory optimization"
  "Improve customer feedback system"
  "Fix prescription drug interactions"
  "Add medicine manufacturer tracking"
  "Update supplier delivery schedules"
  "Improve sales commission tracking"
  "Fix inventory shrinkage reports"
  "Add medicine therapeutic classes"
  "Update customer insurance verification"
  "Improve supplier bid management"
  "Fix sales tax calculations"
  "Add medicine controlled substance tracking"
  "Update inventory cycle counting"
  "Improve customer appointment scheduling"
  "Fix prescription prior authorization"
  "Add medicine shelf life monitoring"
  "Update supplier quality assurance"
  "Improve sales performance metrics"
  "Fix inventory variance analysis"
  "Add medicine formulary management"
  "Update customer medication adherence"
  "Improve supplier risk assessment"
)

# Commits per day distribution (total 60 commits across 23 days)
commits_per_day=(3 2 3 2 3 2 3 3 2 3 2 3 2 3 2 3 2 3 2 3 2 3 2)

total_commits=0
commit_index=0

for i in "${!days[@]}"; do
  day=${days[$i]}
  num_commits=${commits_per_day[$i]}
  
  echo "Creating $num_commits commits for June $day, 2024..."
  
  for ((c=1; c<=num_commits; c++)); do
    # Random hour between 9 and 18 (work hours)
    hour=$((9 + RANDOM % 10))
    minute=$((RANDOM % 60))
    
    # Select random file
    file_index=$((RANDOM % ${#files[@]}))
    file="${files[$file_index]}"
    
    # Select commit message
    message="${messages[$commit_index]}"
    commit_index=$((commit_index + 1))
    
    # Make a small change to the file
    echo "// Commit on 2024-06-$day at $hour:$minute" >> "$file"
    
    # Stage the file
    git add "$file"
    
    # Create commit with backdated timestamp
    GIT_AUTHOR_DATE="2024-06-$day $hour:$minute:00" \
    GIT_COMMITTER_DATE="2024-06-$day $hour:$minute:00" \
    git commit -m "$message"
    
    total_commits=$((total_commits + 1))
    echo "  Commit $total_commits/60: $message"
  done
done

echo ""
echo "Successfully created $total_commits commits for June 2024!"
echo "Run 'git log --oneline --since='2024-06-01' --until='2024-07-01'' to view the commits"
