<template>
  <v-layout align-start justify-center mt-5>
    <v-flex align-center xs12>
      <div class="grid">
        <v-card class="perfil">
          <v-card-text class="perfil__foto">
            <img v-if="fotoPerfil" class="perfil__foto-imagen" :src="fotoPerfil.url" alt="">
            <div class="perfil__foto-editar">
              <v-fab-transition>
                <v-btn v-if="editando" @click="editarFoto" color="primary" icon>
                  <v-icon>edit</v-icon>
                </v-btn>
              </v-fab-transition>
            </div>
          </v-card-text>
          <v-card-text class="perfil__nombres">
            <v-fab-transition>
              <v-btn v-if="editando" @click="editarNombres" color="accent" icon small class="perfil__nombres-editar">
                <v-icon small>edit</v-icon>
              </v-btn>
            </v-fab-transition>
            <span if-editando class="perfil__nombres-texto">
              {{ nombreCompleto }}
            </span>
          </v-card-text>
          <v-card-text class="perfil__descripcion">
            <v-fab-transition>
              <v-btn v-if="editando" @click="editarDescripcion" color="accent" icon small class="perfil__descripcion-editar">
                <v-icon small>edit</v-icon>
              </v-btn>
            </v-fab-transition>
            <span class="perfil__descripcion-texto">
              {{ descripcion }}
            </span>
          </v-card-text>
          <v-card-text class="perfil__biografia">
            <v-fab-transition>
              <v-btn v-if="editando" @click="editarBiografia" color="accent" icon small class="perfil__biografia-editar">
                <v-icon small>edit</v-icon>
              </v-btn>
            </v-fab-transition>
            <a v-if="biografia" :href="biografia" target="_blank" class="perfil__biografia-link">Biografía</a>
          </v-card-text>

          <v-card-actions v-if="permisosEditar" class="perfil__editar">
            <v-flex text-xs-center>
              <v-btn v-if="!editando" :key="'editar'" @click="editando = true" color="primary">Editar</v-btn>
              <v-btn v-else :key="'cancelar'" @click="editando = false" color="grey lighten-3">Cancelar</v-btn>
            </v-flex>
          </v-card-actions>
        </v-card>
        <!-- Edición de Nombres -->
        <v-dialog v-model="editandoNombre" max-width="600" color="primary">
          <v-card class="elevation-12">
            <v-toolbar dark color="secondary">
              <v-toolbar-title class="white--text">Ingresa tus nombres y apellidos</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-text-field label="Nombres" v-model="edicionNombres.nombres" :error-messages="nombresErrors" @blur="$v.edicionNombres.nombres.$touch()" />
              <v-text-field label="Apellidos" v-model="edicionNombres.apellidos" :error-messages="apellidosErrors" @blur="$v.edicionNombres.apellidos.$touch()" />
            </v-card-text>
            <v-card-actions>
              <v-flex text-xs-right>
                <v-btn :depressed="$v.edicionNombres.$invalid" :disabled="$v.edicionNombres.$invalid" right color="primary" @click="guardarNombres">Guardar</v-btn>
                <v-btn right @click="editandoNombre = false">Cancelar</v-btn>
              </v-flex>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- Edición Descripción -->
        <v-dialog v-model="editandoDescripcion" max-width="600">
          <v-card>
            <v-toolbar dark color="secondary" card flat>
              <v-toolbar-title class="white--text">Acerca de ti</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-textarea label="Agrega una breve descripción sobre ti." v-model="edicionDescripcion" rows="7" counter="300" autofocus :error-messages="descripcionErrors"></v-textarea>
            </v-card-text>
            <v-card-actions>
              <v-flex text-xs-right>
                <v-btn :depressed="$v.edicionDescripcion.$invalid" :disabled="$v.edicionDescripcion.$invalid" right color="primary" @click="guardarDescripcion">Guardar</v-btn>
                <v-btn right @click="editandoDescripcion = false">Cancelar</v-btn>
              </v-flex>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- Edición Biografía -->
        <v-dialog v-model="editandoBiografia" max-width="600">
          <v-card>
            <v-toolbar dark color="secondary" card flat>
              <v-toolbar-title class="white--text">Enalce de tu biografía</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-text-field label="Agrega tu página de Facebook, Instagram, Wikipedia, o Web personal." v-model="edicionBiografia" :error-messages="biografiaErrors" />
            </v-card-text>
            <v-card-actions>
              <v-flex text-xs-right>
                <v-btn :depressed="$v.edicionBiografia.$invalid" :disabled="$v.edicionBiografia.$invalid" right color="primary" @click="guardarBiografia">Guardar</v-btn>
                <v-btn right @click="editandoBiografia = false">Cancelar</v-btn>
              </v-flex>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- Edición Foto -->
        <v-dialog v-model="editandoFoto" max-width="600">
          <v-card>
            <v-toolbar dark color="secondary" card flat>
              <v-toolbar-title class="white--text">Imagen de Perfil</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-flex text-xs-center>
                <img v-if="pasoCargaImagen == 1 && fotoPerfil" class="edicionImagen__img" :src="fotoPerfil.url" alt="">
                <div v-if="pasoCargaImagen == 2" ref="preview" class="preview"></div>
                <canvas v-show="false" ref="canvas512x512" width="512" height="512"></canvas>
              </v-flex>
            </v-card-text>
            <v-card-text>
              <file-pond v-if="pasoCargaImagen == 1" label-idle="Selecciona o arrastra un imagen..." accepted-file-types="image/jpeg, image/png" labelFileTypeNotAllowed="Agrega una imagen .png o .jpg" fileValidateTypeLabelExpectedTypes="Se esperaba {allButLastType} o {lastType}" instant-upload="false" @addfile="cargarFoto" />

              <div v-if="pasoCargaImagen == 2" class="editor">
                <img ref="fotoOriginal" src="" alt="Imagen" class="edicionImagen">
              </div>
              <v-flex text-xs-right mt-2>
                <v-btn color="gray" @click="editandoFoto = false">Cancelar</v-btn>
                <v-btn color="primary" @click="guardarImagenTransaccion">Guardar</v-btn>
              </v-flex>
            </v-card-text>
          </v-card>
        </v-dialog>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>

import { db, storage } from '@/firebase'
import { required, minLength, maxLength, url } from 'vuelidate/lib/validators'
import { letrasEspacios } from '@/helpers/validaciones'

import "filepond/dist/filepond.min.css";
import vueFilePond from "vue-filepond";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";

import Cropper from "cropperjs/dist/cropper";
import "cropperjs/dist/cropper.css";

import uuidv4 from "uuid/v4"

const FilePond = vueFilePond(FilePondPluginFileValidateType);
const pica = require("pica")();

export default {
  data() {
    return {
      permisosEditar: false,
      editando: false,
      editandoNombre: false,
      uid: null,
      fotoPerfil: null,
      nombres: '',
      apellidos: '',
      edicionNombres: {
        nombres: '',
        apellidos: '',
      },
      descripcion: '',
      editandoDescripcion: false,
      edicionDescripcion: '',
      biografia: '',
      editandoBiografia: false,
      edicionBiografia: '',
      editandoFoto: false,
      edicionFoto: null,
      pasoCargaImagen: 1,
      cropper: null
    }
  },
  computed: {
    nombreCompleto() {
      return this.nombres + ' ' + this.apellidos
    },
    nombresErrors() {
      const errors = []
      if (!this.$v.edicionNombres.nombres.$dirty) return errors
      !this.$v.edicionNombres.nombres.required && errors.push("El nombre es requerido.")
      !this.$v.edicionNombres.nombres.minLength && errors.push("El nombre debe ser de al menos 3 cifras.")
      !this.$v.edicionNombres.nombres.maxLength && errors.push("El nombre debe ser de máximo 20 cifras.")
      !this.$v.edicionNombres.nombres.letrasEspacios && errors.push("El nombre debe contener solo letras y espacios.")
      return errors
    },
    apellidosErrors() {
      const errors = []
      if (!this.$v.edicionNombres.apellidos.$dirty) return errors
      !this.$v.edicionNombres.apellidos.required && errors.push("El apellido es requerido.")
      !this.$v.edicionNombres.apellidos.minLength && errors.push("El apellido debe ser de al menos 3 cifras.")
      !this.$v.edicionNombres.apellidos.maxLength && errors.push("El apellido debe ser de máximo 20 cifras.")
      !this.$v.edicionNombres.apellidos.letrasEspacios && errors.push("El apellido debe contener solo letras y espacios.")
      return errors
    },
    descripcionErrors() {
      const errors = [];
      if (!this.$v.edicionDescripcion.$dirty) return errors;
      !this.$v.edicionDescripcion.maxLenght && errors.push("Ingresa máximo 300 caracteres")

      return errors
    },
    biografiaErrors() {
      const errors = [];
      if (!this.$v.edicionBiografia.$dirty) return errors;
      !this.$v.edicionBiografia.url && errors.push("Ingresa una url válida.")

      return errors
    }
  },
  created() {
    this.uid = this.$route.params.uid

    db.collection("usuarios")
      .doc(this.uid)
      .get()
      .then(doc => {
        if (doc.exists) {
          let usuario = doc.data()
          this.nombres = usuario.nombres
          this.apellidos = usuario.apellidos
          this.descripcion = usuario.descripcion || ''
          this.biografia = usuario.biografia

          if (usuario.fotoPerfil512) {
            this.fotoPerfil = usuario.fotoPerfil512
          } else {
            this.fotoPerfil = this.$store.state.fotoPerfilDefecto512;
          }

          this.permisosEditar = this.uid == usuario.uid
        }
      })
      .catch(err => {
        console.log(err)
      })
  },
  methods: {
    editarNombres() {
      this.editandoNombre = true
      this.edicionNombres.nombres = this.nombres
      this.edicionNombres.apellidos = this.apellidos
    },
    guardarNombres() {
      this.editandoNombre = false

      db
        .collection("usuarios")
        .doc(this.uid)
        .update(this.edicionNombres)
        .then(() => {
          this.nombres = this.edicionNombres.nombres
          this.apellidos = this.edicionNombres.apellidos
          this.editando = false
        })
        .catch(error => {
          console.log(error)
        })
    },
    editarDescripcion() {
      this.edicionDescripcion = this.descripcion
      this.editandoDescripcion = true
    },
    guardarDescripcion() {
      this.editandoDescripcion = false

      db.collection("usuarios")
        .doc(this.uid)
        .update({
          descripcion: this.edicionDescripcion
        })
        .then(() => {
          this.descripcion = this.edicionDescripcion
          this.editando = false
        })
        .catch(error => {
          console.log(error)
        })
    },
    editarBiografia() {
      this.edicionBiografia = this.biografia
      this.editandoBiografia = true
    },
    guardarBiografia() {
      if (this.edicionBiografia == this.fraseBiografiaInicial) return
      this.editandoBiografia = false

      db.collection("usuarios")
        .doc(this.uid)
        .update({
          biografia: this.edicionBiografia
        })
        .then(() => {
          this.biografia = this.edicionBiografia
          this.editando = false
        })
        .catch(error => {
          console.log(error)
        })
    },
    editarFoto() {
      this.pasoCargaImagen = 1
      this.editandoFoto = true
    },
    cargarFoto(error, file) { // 1. FilePond - Seleccionar y arrastrar foto, posteriormente se lee el archivo cargado y se alamcena en el elemento ref='fotoOriginal'
      if (error) {
        console.log(error)
        return
      }

      this.pasoCargaImagen = 2

      let reader = new FileReader()

      let vm = this;

      reader.onloadend = function () {
        vm.$refs.fotoOriginal.src = reader.result;
        vm.recortarFoto()
      };

      if (file) {
        if (file.file) {
          reader.readAsDataURL(file.file);
        }
      } else {
        this.file = "";
      }
    },
    recortarFoto() { // 2. Cropper - Recorta la foto de acuerdo a un aspect ratio indicado y la manipulación del usuario
      console.log(this.$refs.fotoOriginal)
      this.cropper = new Cropper(this.$refs.fotoOriginal, {
        preview: this.$refs.preview,
        aspectRatio: 1,
        modal: false,
        guides: true,
        sized: false,
        zoomable: false,
        highlight: true,
        background: false,
        autoCrop: true
      });

      this.pasoImagen = 1;
    },
    guardarImagen() { // 3. Escalar la foto y almacenar.
      let canvasOrigen = this.cropper.getCroppedCanvas();
      let canvasDestino = this.$refs.canvas512x512;

      pica
      .resize(canvasOrigen, canvasDestino, { unsharpAmount: 100 })
      .then(() => {
        let imagen = canvasDestino.toDataURL("image/jpeg");
        let fotoId = uuidv4()

        let fotoPerfil = null

        storage
        .ref()
        .child("usuarios/" + this.uid + "/fotos-perfil/" + fotoId + "-512x512.jpg")
        .putString(imagen, "data_url")
        .then(snapshot => {
          return snapshot.ref.getDownloadURL()
        })
        .then(url => {
          
          fotoPerfil = {
            id: fotoId + "-512x512",
            idRaiz: fotoId,
            size: 512,
            fecha: new Date(),
            url: url,
            uid: this.uid
          }

          return db
          .collection("usuarios")
          .doc(this.uid)
          .collection("fotosPerfil")
          .doc(fotoPerfil.id)
          .set(fotoPerfil)
        })
        .then(() => {
          return db
          .collection("usuarios")
          .doc(this.uid)
          .update({fotoPerfil512: fotoPerfil})
        })
        .then(() => {
          return db
          .collection("fotosPerfil")
          .doc(fotoPerfil.id)
          .set(fotoPerfil)
        })
        .then(() => {
          this.editando = false
          this.editandoFoto = false
          this.fotoPerfil = fotoPerfil
        })
        .catch(error => {
          console.log(error)
          this.editando = false
          this.editandoFoto = false
        })
      })
    },
    guardarImagenTransaccion() { // 3. Escalar la foto y almacenar. (Modo transacción)
      let canvasOrigen = this.cropper.getCroppedCanvas();
      let canvasDestino = this.$refs.canvas512x512;

      pica
      .resize(canvasOrigen, canvasDestino, { unsharpAmount: 100 })
      .then(() => {
        let imagen = canvasDestino.toDataURL("image/jpeg");
        let fotoId = uuidv4()

        let fotoPerfil = null

        storage
        .ref()
        .child("usuarios/" + this.uid + "/fotos-perfil/" + fotoId + "-512x512.jpg")
        .putString(imagen, "data_url")
        .then(snapshot => {
          return snapshot.ref.getDownloadURL()
        })
        .then(url => {
          
          fotoPerfil = {
            id: fotoId + "-512x512",
            idRaiz: fotoId,
            size: 512,
            fecha: new Date(),
            url: url,
            uid: this.uid
          }

          let batch = db.batch()

          batch.set(db.collection("usuarios").doc(this.uid).collection("fotosPerfil").doc(fotoPerfil.id), fotoPerfil)
          batch.update(db.collection("usuarios").doc(this.uid), {fotoPerfil512: fotoPerfil})
          batch.set(db.collection("fotosPerfil").doc(fotoPerfil.id), fotoPerfil)

          return batch.commit()
        })
        .then(() => {
          this.editando = false
          this.editandoFoto = false
          this.fotoPerfil = fotoPerfil
        })
        .catch(error => {
          console.log(error)
          this.editando = false
          this.editandoFoto = false
        })
      })
    }
  },  
  validations: {
    edicionNombres: {
      nombres: { required, minLength: minLength(3), maxLength: maxLength(20), letrasEspacios },
      apellidos: { required, minLength: minLength(3), maxLength: maxLength(20), letrasEspacios }
    },
    edicionDescripcion: {
      maxLength: maxLength(300)
    },
    edicionBiografia: {
      url
    }
  },
  components: {
    FilePond
  }
}
</script>


<style>
/* Cropper */
.editor {
  padding: 0;
  margin: 0;
}

.cropper-drag-box {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
}

.filepond--drop-label {
  font-size: 14pt !important;
}

.grid {
  display: grid;
  justify-items: center;
}

.edicionImagen {
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
}

.edicionImagen__img {
  width: 200px;
  height: 200px;
  border-radius: 3px;
}

.preview {
  overflow: hidden;
  margin: 0 auto;
  border-radius: 1%;
  height: 200px;
  width: 200px;
}

.perfil {
  display: grid;

  grid-template-areas:
    "foto nombres"
    "foto descripcion"
    "foto biografia"
    "editar editar";

  align-items: center;

  max-width: 700px;
  width: 100%;
  width: auto;

  grid-gap: 10px;
  padding: 5px;
  border-radius: 3px;
}

.perfil__foto {
  display: grid;
  grid-area: foto;
  justify-items: center;
  justify-content: center;
  align-self: start;
}

.perfil__foto-imagen {
  width: 200px;
  height: 200px;
  border-radius: 3px;
  grid-column: 1;
  grid-row: 1;
}

.perfil__foto-editar {
  align-self: end;
  justify-self: end;
  grid-column: 1;
  grid-row: 1;
  opacity: 0.9;
}

.perfil__nombres {
  display: grid;
  grid-area: nombres;

  grid-auto-flow: column;
  grid-template-columns: max-content min-content;
  align-items: center;
}

.perfil__nombres-editar {
  grid-column: 2;
}

.perfil__nombres-texto {
  font-size: 20px;
  font-weight: bold;

  grid-column: 1;
}

.perfil__descripcion {
  display: grid;
  grid-area: descripcion;

  grid-auto-flow: column;
  grid-template-columns: 1fr min-content;
}

.perfil__descripcion-editar {
  grid-column: 2;
}

.perfil__descripcion-texto {
  font-size: 16px;
  grid-column: 1;
}

.perfil__biografia {
  display: grid;
  grid-area: biografia;
  align-items: center;
  grid-template-columns: max-content min-content;
  grid-auto-flow: column;
}

.perfil__biografia-editar {
  grid-column: 2;
}

.perfil__biografia-link {
  text-decoration: none;
  font-size: 16px;
  color: #6b28c5;
  grid-column: 1;
}

.perfil__editar {
  grid-area: editar;
}

@media only screen and (max-width: 700px) {
  .perfil {
    grid-template-areas:
      "nombres"
      "foto"
      "descripcion"
      "biografia"
      "editar";

    justify-items: center;
  }

  .perfil__nombres {
    justify-items: center;
    justify-content: center;
    grid-template-columns: auto auto;
  }

  .perfil__nombres-texto {
    text-align: center;
  }

  .perfil__descripcion-texto {
    text-align: center;
  }

  .perfil__biografia {
    justify-items: center;
    justify-content: center;
    grid-template-columns: auto auto;
  }
}
</style>

