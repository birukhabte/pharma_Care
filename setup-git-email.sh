#!/bin/bash

# Configure Git with your email
echo "Setting up Git configuration..."

# Set email
git config --global user.email "biruk.habte-ug@aau.edu.et"

# Set name (you can change this if needed)
git config --global user.name "Biruk Habte"

# Verify configuration
echo ""
echo "✅ Git configuration updated:"
echo "Email: $(git config --global user.email)"
echo "Name: $(git config --global user.name)"

echo ""
echo "Now your future commits will use this email."
echo ""
echo "To fix past commits (optional):"
echo "git commit --amend --author='Biruk Habte <biruk.habte-ug@aau.edu.et>' --no-edit"
echo "git push --force"

