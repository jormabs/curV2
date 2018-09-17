<template>
  <v-layout align-start justify-center mt-5>
    <v-flex align-center xs12>
      <div class="grid">
        <v-card class="perfil">
          <v-card-text class="perfil__foto">
            <div class="perfil__foto-imagen"></div>
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
              <v-slide-y-transition mode="out-in">
                <v-btn v-if="!editando" :key="'editar'" @click="editando = true" color="primary">Editar</v-btn>
                <v-btn v-else :key="'cancelar'" @click="editando = false" color="grey lighten-3">Cancelar</v-btn>
              </v-slide-y-transition>
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
      </div>
    </v-flex>
  </v-layout>
</template>

<script>

import { db } from '@/firebase'
import { required, minLength, maxLength, url } from 'vuelidate/lib/validators'
import { letrasEspacios } from '@/helpers/validaciones'

export default {
  data() {
    return {
      permisosEditar: false,
      editando: false,
      editandoNombre: false,
      uid: null,
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
      edicionBiografia: ''
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

          this.permisosEditar = this.uid == usuario.uid
        }
      })
      .catch(err => {
        console.log(err)
      })
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
  }
}
</script>


<style>
.grid {
  display: grid;
  justify-items: center;
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
}

.perfil__foto-imagen {
  width: 200px;
  height: 200px;
  background-color: rgb(136, 173, 243);
}

.perfil__nombres {
  display: grid;
  grid-area: nombres;

  grid-auto-flow: column;
  grid-template-columns: min-content max-content;
  align-items: center;
}

.perfil__nombres-editar {
  grid-column: 1;
}

.perfil__nombres-texto {
  font-size: 20px;
  font-weight: bold;

  grid-column: 2;
}

.perfil__descripcion {
  display: grid;
  grid-area: descripcion;
}

.perfil__descripcion-editar {
  grid-column: 1;
}

.perfil__descripcion-texto {
  font-size: 16px;
  grid-column: 2;
}

.perfil__biografia {
  display: grid;
  grid-area: biografia;
}

.perfil__biografia-editar {
  grid-column: 1;
}

.perfil__biografia-link {
  text-decoration: none;
  font-size: 16px;
  color: #6b28c5;
  grid-column: 2;
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
}
</style>

