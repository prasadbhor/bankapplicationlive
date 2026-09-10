// Shared Jenkins Pipeline Library function
// Every microservice's Jenkinsfile calls this same function instead of
// repeating docker build/push logic. This is how "different Jenkinsfile
// per service" avoids becoming "duplicated pipeline code per service."
//
// Usage in a Jenkinsfile:
//   buildAndPushImage(
//       servicePath: 'services/login-service',
//       imageName:   'myregistry/login-service',
//       imageTag:    "${env.BUILD_NUMBER}"
//   )

def call(Map config) {
    def servicePath = config.servicePath
    def imageName   = config.imageName
    def imageTag    = config.imageTag

    echo "Building Docker image for ${servicePath} -> ${imageName}:${imageTag}"

    dir(servicePath) {
        sh "docker build -t ${imageName}:${imageTag} ."
        sh "docker tag ${imageName}:${imageTag} ${imageName}:latest"

        // In real usage, you'd log in to your registry first, e.g.:
        // withCredentials([usernamePassword(credentialsId: 'docker-registry-creds',
        //     usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
        //     sh "echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin"
        // }

        sh "docker push ${imageName}:${imageTag}"
        sh "docker push ${imageName}:latest"
    }

    echo "Image ${imageName}:${imageTag} built and pushed successfully."
}
