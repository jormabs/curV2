const letrasEspacios = value => {
  if (typeof value === 'undefined' || value === null || value === '') {
    return true
  }
  return /^(?! )(?!.*  )[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ ]+$/.test(value)
}

export { letrasEspacios }