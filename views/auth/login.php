<h1 class="nombre-pagina">Login</h1>
<p class="descripcion-pagina">Inicia Sesión con tus Datos</p>

<?php
include_once __DIR__ . "/../templates/alertas.php";
?>

<form action="/" class="formulario" method="POST">

    <div class="campo">
        <label for="email">E-mail</label>
        <input type="email" name="email" id="email" placeholder="Tu E-mail" />
    </div>

    <div class="campo">
        <label for="password">Password</label>
        <input type="password" id="password" name="password" placeholder="Tu Password" />
    </div>

    <input type="submit" class="boton" value="Iniciar Sesión">

</form>

<div class="acciones">
    <a href="/crear-cuenta">¿Aún no tienes cuenta? Crea una</a>
    <a href="/olvide-password">Olvidé mi password</a>
</div>