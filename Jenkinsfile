pipeline {
    agent any

    environment {
        NODE_VERSION = '18.19.0'
        BUILD_DIR = 'build'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                script {
                    sh '''
                    . ~/.nvm/nvm.sh
                    nvm install ${NODE_VERSION}
                    npm install
                    '''
                }
            }
        }

        stage('Run Tests') {
            steps {
                script {
                    sh '''
                    . ~/.nvm/nvm.sh
                    nvm use ${NODE_VERSION}
                    npm test
                    '''
                }
            }
        }

        stage('Build') {
            steps {
                script {
                    sh '''
                    . ~/.nvm/nvm.sh
                    nvm use ${NODE_VERSION}
                    npm run build
                    '''
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    sh '''
                    echo "Deploying application..."
                    rsync -av --exclude=node_modules --exclude=.git ./ user@your-server:/path/to/deployment
                    pm2 restart all
                    '''
                }
            }
        }
    }

    post {
        success {
            echo 'Build, Test, and Deployment succeeded!'
        }
        failure {
            echo 'Build, Test, or Deployment failed!'
        }
    }
}
