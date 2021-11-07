<?php
require_once '../function/conexion.php';
$opcion = $_POST['opcion'];
switch ($opcion) {
    case 'addDatos':
        echo addDatos();
        break;    
    case 'getDatos':
        echo getDatos();
        break;    
    case 'deleteDatos':
        echo deleteDatos();
        break;    
    case 'updateDatos':
        echo updateDatos();
        break;    
    default:
        echo "opcion desconocida";
        break;
}
function addDatos(){
    $conexion = conectar();
    $conexion->set_charset('utf8');
    $descripcion = $_POST['descripcion'];
    $estado = $_POST['estado'];    
      $insert = "INSERT INTO tareas (descripcion, estado) VALUES ('$descripcion','$estado')";
      $resultado = mysqli_query($conexion,$insert)
      or die ("ERRORS" . mysqli_error($conexion));

      if ($resultado) {
        $respuesta = 1;
      }else {
        $respuesta = 0;
      }

    return $respuesta;
  	mysqli_close($conexion);
}
function getDatos(){
    $conexion = conectar();
    $conexion->set_charset('utf8');    
      $select = "SELECT * FROM tareas WHERE band_eliminar = 1";
      $res_select = mysqli_query($conexion, $select);    
      $tablas = '';
      while($fila = mysqli_fetch_array($res_select)){
        $tablas .= '<div class="row content">
                    <div class="col">'.$fila['id_tarea'].'</div>
                    <div class="col-md-6">'.$fila['descripcion'].'</div>
                    <div class="col">';
                  switch ($fila['estado']) {
                    case '0':
                      $tablas .= '<span class="badge badge-danger" id="badge_'.$fila['id_tarea'].'" data-value="'.$fila['estado'].'"><i class="fas fa-times"></i></span></div>';
                      break;
                    case '1':
                      $tablas .= '<span class="badge badge-success" id="badge_'.$fila['id_tarea'].'" data-value="'.$fila['estado'].'"><i class="fas fa-check"></i></span></div>';
                      break;
                    case '2':
                      $tablas .= '<span class="badge badge-warning" id="badge_'.$fila['id_tarea'].'" data-value="'.$fila['estado'].'"><i class="fas fa-minus"></i></span></div>';
                      break;                  
                    default:
                      break;
                  }      
                  $tablas .= '<div class="col"><button class="btn btn-danger del_tarea" id="del_tarea_'.$fila['id_tarea'].'" value="'.$fila['id_tarea'].'"><i class="fas fa-trash-alt"></i></button></div></div>';
      }

    echo json_encode($tablas);    
  	mysqli_close($conexion);
}
function deleteDatos(){
  $conexion = conectar();
  $id_borrar = $_POST['id_borrar'];
    $eliminar = "UPDATE tareas SET band_eliminar = 0 WHERE id_tarea = $id_borrar";
    $ejecutar = mysqli_query($conexion, $eliminar);
    if ($ejecutar) {
      $respuesta = 1;
    }else {
      $respuesta = 0;
    }

  return $respuesta;
  mysqli_close($conexion);
}
function updateDatos(){
  $conexion = conectar();  
  $id_tarea = $_POST['id_tarea'];
  $estado = $_POST['estado'];
  $id_tarea = str_replace("badge_", "", $id_tarea);
  switch ($estado) {
    case '0':
      $estado = '2';
      break;
    case '1':
      $estado = '0';
      break;
    case '2':
      $estado = '1';
      break;  
    default:
      break;
  }
    $actualizar = "UPDATE tareas SET estado = '$estado' WHERE id_tarea = $id_tarea";
    $resultado = mysqli_query($conexion, $actualizar);
    if ($resultado) {
        $res = 1;
    }else{
      $res = 0;
    }

  return $res;
  mysqli_close($conexion);
}
?>