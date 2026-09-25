pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Backend Install') {
            steps {
                dir('back') {
                    bat 'npm ci'
                }
            }
        }

        stage('Backend Tests') {
            steps {
                dir('back') {
                    bat 'npm test'
                }
            }
        }

        stage('Backend Build') {
            steps {
                dir('back') {
                    bat 'npm run build'
                }
            }
        }
    }
}