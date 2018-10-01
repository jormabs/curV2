import slugify from 'slugify'

const generarFormatoFecha = (fecha, separador, incluirHora) => {
  let dd = fecha.getDate().toString()
  let MM = (fecha.getMonth() + 1).toString() // Enero es igual a 0 y Diciembre es 11
  let yyyy = fecha.getFullYear().toString()

  if (dd.length == 1) {
    dd = '0' + dd
  }

  if (MM.length == 1) {
    MM = '0' + MM
  }

  let formato = yyyy + separador + MM + separador + dd

  if(incluirHora) {
    let hh = fecha.getHours().toString()
    let mm = fecha.getMinutes().toString()

    if (hh.length == 1) {
      hh = '0' + hh
    }

    if (mm.length == 1) {
      mm = '0' + mm
    }

    formato += separador + hh + separador + mm
  }

  return formato
}

const generarFormatoHora = (fecha) => {
  let hh = fecha.getHours().toString()
  let mm = fecha.getMinutes().toString()

  if (hh.length == 1) {
    hh = '0' + hh
  }

  if (mm.length == 1) {
    mm = '0' + mm
  }

  return `${hh}:${mm}`
}

const generarUrlTexto = (texto, separador) => {

  let letrasAcentos = 'áéíóúÁÉÍÓÚüÜñÑ'
  let letrasValidas = 'aeiouAEIOUuUnN'

  let i

  for (i = 0; i < letrasAcentos.length; i++) {
    texto = texto.replace(letrasAcentos[i], letrasValidas[i])
  }

  texto = slugify(texto, {
    replacement: separador,
    remove: /[*+~.()'"¡!/:@¿?,%&"'.]/g,
    lower: true
  })

  return texto
}

export { generarFormatoFecha, generarFormatoHora, generarUrlTexto }