<template>
  <Popup :messages="messages">
    <template slot="header">
      <div>
        <h5>
          <span class="cap-first"> {{ titreNom }} </span
          ><span class="color-neutral"> | </span
          ><span class="cap-first">
            {{ travauxTypeNom }}
          </span>
        </h5>
        <h2 class="cap-first mb-0">
          Suppression de l'étape
        </h2>
      </div>
    </template>

    <p class="bold">
      Souhaitez vous supprimer l'étape de travaux
      <span class="color-inverse">{{ etapeTypeNom }}</span> de la démarche
      <span class="color-inverse">{{ travauxTypeNom }}</span> du titre
      <span class="color-inverse">{{ titreNom }} ({{ titreType }})</span> ?
    </p>
    <div class="bg-warning color-bg p-s mb-l">
      <span class="bold"> Attention </span>: cette opération est définitive et
      ne peut pas être annulée.
    </div>

    <template slot="footer">
      <div v-if="!loading" class="tablet-blobs">
        <div class="tablet-blob-1-3 mb tablet-mb-0">
          <button class="btn-border rnd-xs p-s full-x" @click="cancel">
            Annuler
          </button>
        </div>
        <div class="tablet-blob-2-3">
          <button class="btn-flash rnd-xs p-s full-x" @click="remove">
            Supprimer
          </button>
        </div>
      </div>
      <div v-else class="p-s full-x bold">
        Suppression en cours…
      </div>
    </template>
  </Popup>
</template>

<script>
import Popup from '../../_ui/popup.vue'

export default {
  name: 'CaminoTravauxEtapeRemovePopup',

  components: {
    Popup
  },

  props: {
    etapeTypeNom: { type: String, default: '' },
    travauxTypeNom: { type: String, default: '' },
    etapeId: { type: String, default: '' },
    titreNom: { type: String, default: '' },
    titreType: { type: String, default: '' }
  },

  computed: {
    loading() {
      return this.$store.state.popup.loading
    },

    messages() {
      return this.$store.state.popup.messages
    }
  },

  created() {
    document.addEventListener('keyup', this.keyup)
  },

  beforeDestroy() {
    document.removeEventListener('keyup', this.keyup)
  },

  methods: {
    async remove() {
      await this.$store.dispatch('titreTravauxEtape/remove', this.etapeId)
    },

    cancel() {
      this.errorsRemove()
      this.$store.commit('popupClose')
    },

    keyup(e) {
      if ((e.which || e.keyCode) === 27) {
        this.cancel()
      } else if ((e.which || e.keyCode) === 13) {
        this.remove()
      }
    },

    errorsRemove() {
      // this.$store.commit('utilisateur/loginMessagesRemove')
    }
  }
}
</script>
