pipeline {
    agent any

    //set environment
    environment {
        NODE_ENV = 'test'
        MUSIC_RES = 'ci-test-res'

        DEPLOY_DIR = '/home/ubuntu/discueue'
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Backend Install') {
            steps {
                dir('back') {
                    sh 'npm ci'
                }
            }
        }

        //create environment variables
        stage('Prepare Test Environment') {
            steps {
                dir('back') {
                    sh '''
                        mkdir -p ci-test-res
                        openssl rand -out secret-key 32
                    '''
                }
            }
        }

        stage('Backend Tests') {
            steps {
                dir('back') {
                    sh 'npm test'
                }
            }
        }

        stage('Backend Build') {
            steps {
                dir('back') {
                    sh 'npm run build'
                }
            }
        }

        stage('Frontend Install') {
            steps {
                dir('front') {
                    sh 'npm ci'
                }
            }
        }

        stage('Frontend Build') {
            steps {
                dir('front') {
                    sh 'npm run build'
                }
            }
        }


        //deployment
        stage('Deploy Backend') {
            steps {
                sh '''
                    rm -rf "$DEPLOY_DIR/back/dist/"*
                    cp -r back/dist/. "$DEPLOY_DIR/back/dist/"
                '''
            }
        }

        stage('Deploy Frontend') {
            steps {
                sh '''
                    rm -rf "$DEPLOY_DIR/front/dist/"*
                    cp -r front/dist/. "$DEPLOY_DIR/front/dist/"
                '''
            }
        }

        stage('Restart Backend') {
            steps {
                sh 'sudo systemctl restart discueue.service'
            }
        }

        stage('Health Check') {
            steps {
                sh '''
                    sleep 2
                    curl --fail http://localhost:3000/health
                '''
            }
        }
    }

    post {
        success {
            echo 'Discueue CI/CD completed successfully!'
        }

        failure {
            echo 'Discueue CI/CD failed.'
        }

        always {
            sh '''
                rm -rf back/ci-test-res
                rm -f back/secret-key
            '''
        }
    }
}