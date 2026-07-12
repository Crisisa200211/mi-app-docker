pipeline {
    // Le indicamos a Jenkins que requiere un entorno con el motor de Docker activo
    agent {
        docker {
            image 'docker:latest'
            // Enlazamos el socket interno de comunicación con el daemon
            args '-v /var/run/docker.sock:/var/run/docker.sock'
        }
    }
    
    environment {
        REGISTRY = 'ghcr.io' 
        IMAGE_NAME = 'Crisisa200211/mi-app-docker'
        
        COMMIT_SHA = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
        BUILD_TIMESTAMP = sh(script: 'date +%Y%m%d-%H%M%S', returnStdout: true).trim()
        
        IMAGE_TAG_LATEST = "${REGISTRY}/${IMAGE_NAME}:latest"
        IMAGE_TAG_COMMIT = "${REGISTRY}/${IMAGE_NAME}:${COMMIT_SHA}"
        IMAGE_TAG_BUILD  = "${REGISTRY}/${IMAGE_NAME}:build-${BUILD_TIMESTAMP}"
    }
    
    stages {
        stage('Prepare') {
            steps {
                echo ' 🐳 Comprobando entorno Docker...'
                sh 'docker --version'
            }
        }
        
        stage('Build Docker Image') {
            steps {
                echo ' 📦 Construyendo Imagen Docker...'
                sh "docker build -t ${IMAGE_TAG_COMMIT} ."
            }
        }
        
        stage('Push to Registry') {
            when {
                branch 'main' 
            }
            steps {
                echo ' 📤 Publicando imagen en GitHub Container Registry (GHCR)...'
                
                withCredentials([string(credentialsId: 'github-token', variable: 'GITHUB_TOKEN')]) {
                    sh '''
                        echo $GITHUB_TOKEN | docker login ghcr.io -u Crisisa200211 --password-stdin
                    '''
                    sh """
                        docker tag ${IMAGE_TAG_COMMIT} ${IMAGE_TAG_LATEST}
                        docker tag ${IMAGE_TAG_COMMIT} ${IMAGE_TAG_BUILD}
                        
                        docker push ${IMAGE_TAG_COMMIT}
                        docker push ${IMAGE_TAG_LATEST}
                        docker push ${IMAGE_TAG_BUILD}
                    """
                }
            }
        }
        
        stage('Verify Published Image') {
            when { branch 'main' }
            steps {
                echo " ✅ Imagen publicada con éxito en GitHub: ${IMAGE_TAG_COMMIT}"
            }
        }
    }
    
    post {
        success {
            echo ' 🎉 ¡Pipeline completado de inicio a fin exitosamente!'
        }
        failure {
            echo ' ❌ El pipeline falló en alguna de las etapas.'
        }
        cleanup {
            echo ' 🧹 Limpiando imágenes locales residuales...'
            sh "docker image prune -f"
        }
    }
}
