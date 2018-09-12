import Vue from 'vue'
import {
  Vuetify,
  VApp,
  VNavigationDrawer,
  VFooter,
  VList,
  VBtn,
  VIcon,
  VGrid,
  VToolbar,
  VCard,
  transitions,
  VForm,
  VTextField,
  VMenu,
  VDatePicker,
  VRadioGroup,
  VSnackbar,
  VTabs,
  VDialog,
  VChip,
  VProgressCircular,
  VProgressLinear,
  VSpeedDial,
  VImg,
  VTextarea,
  VAutocomplete
} from 'vuetify'
import 'vuetify/src/stylus/app.styl'

Vue.use(Vuetify, {
  components: {
    Vuetify,
    VApp,
    VNavigationDrawer,
    VFooter,
    VList,
    VBtn,
    VIcon,
    VGrid,
    VToolbar,
    VCard,
    transitions,
    VForm,
    VTextField,
    VMenu,
    VDatePicker,
    VRadioGroup,
    VSnackbar,
    VTabs,
    VDialog,
    VChip,
    VProgressCircular,
    VProgressLinear,
    VSpeedDial,
    VImg,
    VTextarea,
    VAutocomplete
  },
  theme: {
    primary: '#FF5B8B',
    secondary: '#a851f1',
    accent: '#82B1FF',
    error: '#FF5252',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FFC107'
  },
})
