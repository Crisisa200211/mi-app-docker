pipeline {
    agent any // Agente configurado 
    
    environment {
        REGISTRY = 'ghcr.io' // Registro GitHub 
        IMAGE_NAME = 'Crisisa200211/mi-app-docker' // Formato obligatorio: usuario/repo [cite: 29]
        
        // Variables de versionado dinámico [cite: 29]
        COMMIT_SHA = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
        BUILD_TIMESTAMP = sh(script: 'date +%Y%m%d-%H%M%S', returnStdout: true).trim()
        
        // Definición de múltiples Tags obligatorios 
        IMAGE_TAG_LATEST = "${REGISTRY}/${IMAGE_NAME}:latest"
        IMAGE_TAG_COMMIT = "${REGISTRY}/${IMAGE_NAME}:${COMMIT_SHA}"
        IMAGE_TAG_BUILD  = "${REGISTRY}/${IMAGE_NAME}:build-${BUILD_TIMESTAMP}"
    }
    
    stages {
        // STAGE 1: Preparación [cite: 30]
        stage('Prepare') {
            steps {
                echo ' Preparando entorno...' [cite: 30]
                sh 'docker --version' [cite: 31]
                sh 'node --version' [cite: 31]
                sh 'npm --version' [cite: 31]
            }
        }
        
        // STAGE 2: Instalación de Dependencias [cite: 31, 32]
        stage('Install Dependencies') {
            steps {
                echo ' 📥  Instalando dependencias...' [cite: 32]
                sh 'npm ci' // Instalación limpia [cite: 32]
            }
        }
        
        // STAGE 3: Ejecutar Tests [cite: 33]
        stage('Test') {
            steps {
                echo ' 🧪  Ejecutando tests...' [cite: 33]
                sh 'npm test' [cite: 33]
            }
            post {
                always {
                    // Publicación obligatoria de reportes JUnit 
                    junit 'test-results/**/*.xml' [cite: 34]
                }
            }
        }
        
        // STAGE 4: Construcción de Imagen Docker [cite: 35]
        stage('Build Docker Image') {
            steps {
                echo ' 🐳  Construyendo imagen Docker...' [cite: 36]
                script {
                    // Uso nativo de la clase docker.build del plugin [cite: 36]
                    docker.build("${IMAGE_TAG_COMMIT}") [cite: 36]
                }
            }
        }
        
        // STAGE 5: Publicación en Registro (GHCR con Credenciales) [cite: 36, 37]
        stage('Push to Registry') {
            when {
                branch 'main' // Cláusula condicional obligatoria [cite: 37]
            }
            steps {
                echo ' 📤  Publicando imagen en GitHub Container Registry...' [cite: 38]
                // Extracción segura del token desde las credenciales globales de Jenkins [cite: 52]
                withCredentials([string(credentialsId: 'github-token', variable: 'GITHUB_TOKEN')]) {
                    sh '''
                        echo $GITHUB_TOKEN | docker login ghcr.io -u Crisisa200211 --password-stdin
                    '''
                    // Taggear la imagen con las múltiples versiones exigidas [cite: 40]
                    sh """
                        docker tag ${IMAGE_TAG_COMMIT} ${IMAGE_TAG_LATEST}
                        docker tag ${IMAGE_TAG_COMMIT} ${IMAGE_TAG_BUILD}
                    """
                    // Publicación real de todas las variantes [cite: 42]
                    sh """
                        docker push ${IMAGE_TAG_COMMIT}
                        docker push ${IMAGE_TAG_LATEST}
                        docker push ${IMAGE_TAG_BUILD}
                    """
                }
            }
        }
        
        // STAGE 6: Verificación [cite: 43]
        stage('Verify Published Image') {
            when { branch 'main' } [cite: 44]
            steps {
                echo ' ✅  Verificando imagen publicada...' [cite: 44]
                script {
                    sh """
                        echo " 📦  Imagen publicada: ${IMAGE_TAG_COMMIT}"
                        echo " 🏷 ️ Tags disponibles:"
                        echo "  - ${IMAGE_TAG_COMMIT}"
                        echo "  - ${IMAGE_TAG_LATEST}"
                        echo "  - ${IMAGE_TAG_BUILD}"
                    """
                }
            }
        }
    }
    
    // POST: Acciones finales de notificación y limpieza 
    post {
        success {
            echo ' 🎉  Pipeline completado exitosamente!' [cite: 47]
            // Notificación extendida de correo en caso de éxito [cite: 48]
            emailext (
                subject: " ✅  Pipeline Success: \${JOB_NAME} - \${BUILD_NUMBER}",
                body: "El pipeline se ha completado exitosamente.\n\nImagen publicada: ${IMAGE_TAG_COMMIT}",
                to: 'tu-correo@ejemplo.com' // Cambia por tu dirección de correo real [cite: 48]
            )
        }
        failure {
            echo ' ❌  Pipeline falló!' [cite: 49]
            // Notificación extendida de correo en caso de fallo [cite: 50]
            emailext (
                subject: " ❌  Pipeline Failed: \${JOB_NAME} - \${BUILD_NUMBER}",
                body: "El pipeline ha fallado. Revisa los logs para más detalles.",
                to: 'tu-correo@ejemplo.com' [cite: 50]
            )
        }
        cleanup {
            echo ' 🧹  Limpiando recursos...' [cite: 51]
            script {
                // Eliminación obligatoria de imágenes huérfanas locales para ahorrar espacio [cite: 51]
                sh "docker image prune -f" [cite: 51]
            }
        }
    }
}