<h1 class="nombre-pagina">
    Panel de Administración
</h1>

<?php
include_once __DIR__ . '/../templates/barra.php';
?>

<h2>Buscar Citas</h2>

<div class="busqueda">
    <div class="formulario">
        <div class="campo">
            <label for="fecha">Fecha</label>
            <input type="date" id="fecha" name="fecha">
        </div>
    </div>
</div>


<div id="citas-admin"></div>