pipeline {
    agent any

    environment {
        APP_NAME = "frontend"
        APP_PORT = "3000"
    }

    stages {

        stage('Build Docker Image') {
            steps {
                sh '''
                docker build -t frontend-app .
                '''
            }
        }

        stage('Deploy Frontend') {
            steps {
                sh '''
                docker stop frontend || true
                docker rm frontend || true

                docker run -d \
                  --name frontend \
                  -p 3000:3000 \
                  --restart unless-stopped \
                  frontend-app
                '''
            }
        }
    }

    post {
        success {
            echo "✅ Frontend deployed successfully"
        }
        failure {
            echo "❌ Frontend deployment failed"
        }
    }
}
