pipeline {
  agent any

  environment {
    IMAGE_NAME = "aishuachar/frontend"
    VM_USER = "azureuser"
    VM_IP = "20.193.253.189"
  }

  stages {

    stage('Set Branch Variables') {
      steps {
        script {
          if (env.BRANCH_NAME == 'main') {
            env.APP_NAME = 'frontend-prod'
            env.HOST_PORT = '3000'
            env.ENV_FILE = '/home/azureuser/frontend-main.env'
          }

          if (env.BRANCH_NAME == 'master') {
            env.APP_NAME = 'frontend-test'
            env.HOST_PORT = ''
            env.ENV_FILE = '/home/azureuser/frontend-master.env'
          }
        }
      }
    }

    stage('Checkout Code') {
      steps {
        git branch: env.BRANCH_NAME,
        credentialsId: 'github-token',
        url: 'https://github.com/CropNow/cropdesk_Frontend_Nest.git'
      }
    }

    stage('Build Docker Image') {
      steps {
        sh "docker build --no-cache -t $IMAGE_NAME:${BRANCH_NAME} ."
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
          docker push $IMAGE_NAME:${BRANCH_NAME}
          '''
        }
      }
    }

    stage('Deploy to Azure VM') {
      steps {
        sshagent(['azure-vm-ssh']) {
          sh '''
          ssh -o StrictHostKeyChecking=no $VM_USER@$VM_IP "
          docker pull $IMAGE_NAME:${BRANCH_NAME} &&
          docker rm -f $APP_NAME || true &&
          docker run -d \
            --name $APP_NAME \
            --env-file $ENV_FILE \
            -p $HOST_PORT: \
            --restart unless-stopped \
            $IMAGE_NAME:${BRANCH_NAME}
          "
          '''
        }
      }
    }
  }
}