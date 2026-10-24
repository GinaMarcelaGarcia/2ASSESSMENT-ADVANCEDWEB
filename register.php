<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Create Account | TrackBack</title>

    <!-- Bootstrap e ícones -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" rel="stylesheet">
    <link href="assets/css/auth.css" rel="stylesheet">
</head>
<body class="bg-light">
    <main class="container d-flex justify-content-center align-items-center min-vh-100">
        <div class="card shadow" style="width: 100%; max-width: 400px;">

            <!-- Barra do topo -->
            <div class="card-header d-flex justify-content-between align-items-center text-white" style="background-color: #C1330F;">
                <span class="fw-bold">TrackBack</span>
                <a href="index.php" class="text-white text-decoration-none fs-5">&times;</a>
            </div>

            <div class="card-body p-4">
                <h1 class="h4 text-center fw-bold">Create Account</h1>
                <p class="text-center small">
                    Already have an account? <a href="login.php" style="color: #C1330F;">Sign in</a>
                </p>

                <form action="register.php" method="post">
                    <div class="mb-3">
                        <input type="text" name="username" class="form-control rounded-pill" placeholder="Username">
                    </div>

                    <div class="mb-3">
                        <input type="email" name="email" class="form-control rounded-pill" placeholder="E-mail">
                    </div>

                    <div class="mb-3 input-group">
                        <input type="password" name="password" class="form-control rounded-start-pill" placeholder="Password">
                        <button type="button" class="input-group-text rounded-end-pill bg-white toggle-password"><i class="bi bi-eye"></i></button>
                    </div>

                    <div class="mb-4 input-group">
                        <input type="password" name="confirm_password" class="form-control rounded-start-pill" placeholder="Repeat password">
                        <button type="button" class="input-group-text rounded-end-pill bg-white toggle-password"><i class="bi bi-eye"></i></button>
                    </div>

                    <div class="text-center">
                        <button type="submit" class="btn text-white rounded-pill px-5" style="background-color: #C1330F;">Sign Up</button>
                    </div>
                </form>
            </div>

        </div>
    </main>
    <script src="assets/js/register.js"></script>
</body>
</html>