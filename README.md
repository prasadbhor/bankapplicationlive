# Banking Microservices Demo (for learning CI/CD)

A deliberately simple, runnable example of the architecture we discussed:
- 3 independent microservices (login, account, payment)
- 1 API gateway routing requests to them
- 1 Jenkinsfile per service, all calling a shared Jenkins library
- Dockerfiles for each service
- docker-compose to run everything together locally

This is a **learning sandbox**, not production banking code — no real auth,
no real database, no real payment processing.

## Project structure

```
banking-microservices-demo/
├── api-gateway/                  # Routes requests to the right service
│   ├── src/index.js
│   ├── package.json
│   └── Dockerfile
├── services/
│   ├── login-service/
│   │   ├── src/index.js
│   │   ├── package.json
│   │   ├── Dockerfile
│   │   └── Jenkinsfile           # This service's own pipeline
│   ├── account-service/
│   │   └── ... (same pattern)
│   └── payment-service/
│       └── ... (same pattern)
├── shared/
│   └── jenkins-shared-library/
│       └── vars/
│           └── buildAndPushImage.groovy   # Reused by every Jenkinsfile
├── docker-compose.yml            # Run all 4 containers together
├── GIT_SETUP.md                  # Commands to push this to your GitHub with branches
└── README.md
```

## Run it locally

```bash
docker-compose up --build
```

Then try:
```bash
curl -X POST http://localhost:4000/login -H "Content-Type: application/json" -d '{"username":"demo","password":"1234"}'
curl http://localhost:4000/account/1001
curl -X POST http://localhost:4000/payment/transfer -H "Content-Type: application/json" -d '{"fromAccount":"1001","toAccount":"1002","amount":500}'
```

All requests go through the **api-gateway** (port 4000), which proxies to the
right backend service — exactly like the "synchronous request flow" diagram
we discussed earlier.

## How the pieces map to what we discussed

| What we talked about | Where it is here |
|---|---|
| Feature branch per microservice | You'll create `login-feature`, `paymentgateway-feature` branches (see GIT_SETUP.md) |
| Different Jenkinsfile per service | `services/*/Jenkinsfile` — each is separate |
| Shared pipeline logic (not duplicated) | `shared/jenkins-shared-library/vars/buildAndPushImage.groovy` |
| Multiple Docker images built by CI | Each service has its own `Dockerfile`; only changed services rebuild |
| API gateway routing | `api-gateway/src/index.js` |
| Blue-green / CD | Not runnable here (needs real infra) — see the CD pipeline explanation and diagram from our chat for the stages that would follow after the image is pushed |

## Setting up the Jenkins shared library (real Jenkins only)

In a real Jenkins instance, you'd register `shared/jenkins-shared-library` as a
**Global Pipeline Library** under *Manage Jenkins → System → Global Pipeline
Libraries*, naming it `banking-shared-library` (matching the `@Library(...)`
line at the top of each Jenkinsfile).

## Next steps to make this "real"

- Add a real database (Postgres) instead of the in-memory account list
- Add real tests (Jest) instead of the placeholder `npm test`
- Add Kafka for the async events discussed earlier (payment → notification/fraud/audit)
- Replace manual `docker build/push` in the shared library with a real Jenkins agent + registry credentials
