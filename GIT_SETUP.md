# Pushing this project to your GitHub with the branch strategy we discussed

Run these **on your own machine**, using your own GitHub login (never share
credentials in a chat with anyone, including an AI assistant).

## 1. Create an empty repo on GitHub first
Go to github.com → New repository → name it e.g. `banking-microservices-demo`
→ do NOT initialize with a README (we already have one) → Create.

## 2. Initialize git locally and push `main`

```bash
cd banking-microservices-demo
git init
git add .
git commit -m "Initial commit: microservices demo with CI/CD structure"
git branch -M main
git remote add origin https://github.com/<your-username>/banking-microservices-demo.git
git push -u origin main
```

## 3. Create the `develop` branch

```bash
git checkout -b develop
git push -u origin develop
```

## 4. Create the microservice feature branches

```bash
git checkout -b login-feature develop
git push -u origin login-feature

git checkout -b paymentgateway-feature develop
git push -u origin paymentgateway-feature
```

## 5. Create a hotfix branch (only when needed, from main)

```bash
git checkout main
git checkout -b hotfix/critical-login-bug
# ...fix, commit...
git push -u origin hotfix/critical-login-bug
# Then raise 2 PRs: hotfix -> main, and hotfix -> develop
```

## 6. Simulate the task-branch workflow we discussed

```bash
git checkout login-feature
git pull origin login-feature
git checkout -b task/login-otp-fix
# ...make a change in services/login-service/src/index.js...
git add .
git commit -m "Add OTP validation for login feature"
git push -u origin task/login-otp-fix
```

Then on GitHub: open a Pull Request with **base = login-feature**,
**compare = task/login-otp-fix**, and merge it once reviewed.

## 7. Protect your branches (recommended, matches real corporate setups)

On GitHub: **Settings → Branches → Add branch protection rule**
- Apply to `main` and `develop`
- Require a pull request before merging
- Require status checks (CI) to pass before merging
- This blocks direct pushes — exactly like the corporate setup we discussed.

## 8. Connect Jenkins (only if you have a Jenkins server)

In Jenkins: **New Item → Multibranch Pipeline** → point it at this GitHub
repo → Jenkins will auto-detect the `Jenkinsfile` in each branch and build
accordingly. This is what makes "different Jenkinsfile per branch" work in
practice — Jenkins scans branches and runs whichever Jenkinsfile it finds.
