pipeline {
  agent any

  environment {
    IMAGE_NAME = "aishuachar/frontend"
    VM_USER = "azureuser"
    VM_IP = "20.193.253.189"
    APP_NAME = "frontend-prod"
    HOST_PORT = "3000"
    ENV_FILE = "/home/azureuser/frontend.env"
  }

  stages {

    stage('Build Docker Image') {
      steps {
        sh "docker build --no-cache -t $IMAGE_NAME:latest ."
      }
    }

    stage('Push Image') {
      steps {
        withCredentials([usernamePassword(
          credentialsId: 'dockerhub-creds',
          usernameVariable: 'DOCKER_USER',
          passwordVariable: 'DOCKER_PASS'
        )]) {
          sh '''
          echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
          docker push $IMAGE_NAME:latest
          '''
        }
      }
    }

    stage('Deploy to Azure VM') {
      steps {
        sshagent(['azure-vm-ssh']) {
          sh '''
          ssh -o StrictHostKeyChecking=no $VM_USER@$VM_IP "
          docker pull $IMAGE_NAME:latest &&
          docker rm -f $APP_NAME || true &&
          docker run -d \
            --name $APP_NAME \
            --env-file $ENV_FILE \
            -p $HOST_PORT:3000 \
            --restart unless-stopped \
            $IMAGE_NAME:latest
          "
          '''
        }
      }
    }
  }
}