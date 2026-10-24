<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sign In | TrackBack</title>

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
                <h1 class="h4 text-center fw-bold mb-4">Sign In</h1>

                <form id="loginForm" action="login.php" method="post" novalidate>
                    <div class="mb-3">
                        <input type="email" id="email" name="email" class="form-control rounded-pill" placeholder="email@example.com">
                        <div class="invalid-feedback">Please enter a valid e-mail.</div>
                    </div>

                    <div class="mb-1 input-group has-validation">
                        <input type="password" id="password" name="password" class="form-control rounded-start-pill" placeholder="Password">
                        <button type="button" class="input-group-text rounded-end-pill bg-white toggle-password"><i class="bi bi-eye"></i></button>
                        <div class="invalid-feedback">Please enter your password.</div>
                    </div>

                    <div class="text-end mb-4">
                        <a href="#" class="small text-decoration-none" style="color: #C1330F;">Forgot password?</a>
                    </div>

                    <div class="text-center">
                        <button type="submit" class="btn text-white rounded-pill px-5" style="background-color: #C1330F;">Sign In</button>
                    </div>
                </form>

                <p class="text-center small text-muted my-2">Or</p>

                <div class="text-center">
                    <a href="index.php" class="btn rounded-pill px-4" style="border: 1px solid #C1330F; color: #C1330F;">Continue as guest</a>
                </div>

                <p class="text-center small mt-4 mb-0">
                    Don't have an account? <a href="register.php" class="fw-bold text-decoration-none" style="color: #C1330F;">Sign Up</a>
                </p>
            </div>

        </div>
    </main>

</body>
</html>