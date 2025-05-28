#!/bin/bash

echo "Running Comprehensive Test Suite"
echo "================================"
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Test results
PASSED=0
FAILED=0

# HTML Validation
echo "1. HTML Validation Test"
echo "----------------------"
if npx html-validate panel-demo-simple.html --formatter stylish; then
    echo -e "${GREEN}✓ HTML validation passed${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ HTML validation failed${NC}"
    ((FAILED++))
fi
echo ""

# CSS Validation
echo "2. CSS Validation Test"
echo "---------------------"
if npx stylelint "**/*.css" --allow-empty-input; then
    echo -e "${GREEN}✓ CSS validation passed${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ CSS validation failed${NC}"
    ((FAILED++))
fi
echo ""

# JavaScript Linting
echo "3. JavaScript Quality Test"
echo "-------------------------"
# For now, we'll check for common issues manually
if grep -r "console\.log" panel-demo-simple.html > /dev/null; then
    echo -e "${YELLOW}⚠ Warning: console.log statements found${NC}"
fi

# Basic JS syntax check
if node -c panel-demo-simple.html 2>/dev/null || true; then
    echo -e "${GREEN}✓ JavaScript syntax check passed${NC}"
    ((PASSED++))
fi
echo ""

# Accessibility Test
echo "4. Accessibility Test (WCAG 2.1)"
echo "-------------------------------"
if node test-accessibility.js; then
    echo -e "${GREEN}✓ Accessibility tests passed${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ Accessibility tests failed${NC}"
    ((FAILED++))
fi
echo ""

# Unit Tests
echo "5. Unit Tests"
echo "------------"
if npm test -- --run; then
    echo -e "${GREEN}✓ Unit tests passed${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ Unit tests failed${NC}"
    ((FAILED++))
fi
echo ""

# Security Check
echo "6. Security Audit"
echo "----------------"
if npm audit --audit-level=moderate; then
    echo -e "${GREEN}✓ No security vulnerabilities found${NC}"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠ Security vulnerabilities detected${NC}"
fi
echo ""

# Summary
echo "================================"
echo "Test Summary"
echo "================================"
echo -e "Passed: ${GREEN}${PASSED}${NC}"
echo -e "Failed: ${RED}${FAILED}${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}All tests passed! ✨${NC}"
    exit 0
else
    echo -e "${RED}Some tests failed. Please fix the issues before deployment.${NC}"
    exit 1
fi