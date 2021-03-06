<template>
  <Popup :messages="messages">
    <template slot="header">
      <div>
        <h5>
          <span class="cap-first"> {{ titreNom }} </span
          ><span class="color-neutral"> | </span
          ><span class="cap-first">
            {{ demarcheType.nom }}
          </span>
        </h5>
        <h2 class="cap-first mb-0">
          {{ creation ? "Ajout d'une " : "Modification de l'" }}étape
        </h2>
      </div>
    </template>

    <div v-if="dateIsVisible" class="tablet-blobs">
      <div class="tablet-blob-1-3 tablet-pt-s pb-s">
        <h6>Date</h6>
      </div>
      <div class="tablet-blob-2-3">
        <InputDate v-model="date" class="mb" />
      </div>
    </div>

    <div v-else>
      <div class="tablet-blobs">
        <div class="tablet-blob-1-3 tablet-pt-s pb-s">
          <h6>Date</h6>
        </div>
        <div class="tablet-blob-2-3">
          <InputDate
            v-model="etape.date"
            :class="{ 'mb-s': etape.date, mb: !etape.date }"
          />
          <label v-if="etape.date" class="h5">
            <input v-model="etape.incertitudes.date" type="checkbox" /> donnée
            incertaine
          </label>
        </div>
      </div>

      <hr />

      <div class="tablet-blobs">
        <div class="tablet-blob-1-3 tablet-pt-s pb-s">
          <h6>Type</h6>
        </div>
        <div class="mb tablet-blob-2-3">
          <select v-model="etape.typeId" class="p-s" @change="typeUpdate">
            <option
              v-for="eType in etapeTypes"
              :key="eType.id"
              :value="eType.id"
              :disabled="etape.typeId === eType.id"
            >
              {{ eType.nom }}
            </option>
          </select>
        </div>
      </div>

      <hr />

      <div v-if="etape.typeId">
        <div class="tablet-blobs">
          <div class="tablet-blob-1-3 tablet-pt-s pb-s">
            <h6>Statut</h6>
          </div>
          <div class="mb tablet-blob-2-3">
            <select v-model="etape.statutId" class="p-s">
              <option
                v-for="etapeStatut in etapesStatuts"
                :key="etapeStatut.id"
                :value="etapeStatut.id"
                :disabled="etape.statutId === etapeStatut.id"
              >
                {{ etapeStatut.nom }}
              </option>
            </select>
          </div>
        </div>
        <hr />
      </div>

      <EtapeEditFondamentales
        v-if="etapeType.fondamentale"
        :etape.sync="etape"
        :domaine-id="domaineId"
      />

      <EtapeEditPoints
        v-if="etapeType.fondamentale"
        :etape.sync="etape"
        :events.sync="events"
      />

      <EditSections
        v-if="etapeType.sections"
        :sections="etapeType.sections"
        :element.sync="etape"
      />
    </div>

    <template slot="footer">
      <div v-if="!loading" class="tablet-blobs">
        <div class="tablet-blob-1-3 mb tablet-mb-0">
          <button class="btn-border rnd-xs p-s full-x" @click="cancel">
            Annuler
          </button>
        </div>
        <div class="tablet-blob-2-3">
          <button
            v-if="etape.date"
            class="btn-flash rnd-xs p-s full-x"
            :disabled="!complete"
            :class="{ disabled: !complete }"
            @click="save"
          >
            Enregistrer
          </button>
          <button
            v-else
            class="btn-flash rnd-xs p-s full-x"
            :disabled="!date"
            :class="{ disabled: !date }"
            @click="metasGet"
          >
            Valider
          </button>
        </div>
      </div>

      <div v-else class="p-s full-x bold">Enregistrement en cours…</div>
    </template>
  </Popup>
</template>

<script>
import InputDate from '../../_ui/input-date.vue'
import Popup from '../../_ui/popup.vue'
import EtapeEditFondamentales from './edit-fondamentales.vue'
import EtapeEditPoints from './edit-points.vue'
import EditSections from '../../_common/edit-sections.vue'

import { etapeSaveFormat } from './edit'

export default {
  name: 'CaminoEtapeEditPopup',

  components: {
    Popup,
    EtapeEditFondamentales,
    EtapeEditPoints,
    EditSections,
    InputDate
  },

  props: {
    etape: { type: Object, default: () => ({}) },
    demarcheType: { type: Object, default: () => ({}) },
    domaineId: { type: String, default: '' },
    titreNom: { type: String, default: '' },
    creation: { type: Boolean, default: false }
  },

  data() {
    return {
      events: { saveKeyUp: true },
      date: ''
    }
  },

  computed: {
    loading() {
      return this.$store.state.popup.loading
    },

    messages() {
      return this.$store.state.popup.messages
    },

    etapeTypes() {
      return this.$store.state.titreEtape.metas.etapesTypes.filter(
        t => t.etapesCreation
      )
    },

    etapeType() {
      return this.etapeTypes.find(et => et.id === this.etape.typeId) || {}
    },

    etapesStatuts() {
      return this.etapeType.etapesStatuts
    },

    dateIsVisible() {
      return (
        (this.etape.id && !this.etape.date && !this.date) ||
        (!this.etape.id && !this.etape.date)
      )
    },

    complete() {
      return this.etape.typeId && this.etape.date && this.etape.statutId
    }
  },

  async created() {
    document.addEventListener('keyup', this.keyUp)

    if (this.etape.date) {
      this.date = this.etape.date
      this.metasGet()
    }
  },

  beforeDestroy() {
    document.removeEventListener('keyup', this.keyUp)
  },

  methods: {
    async metasGet() {
      await this.$store.dispatch('titreEtape/metasGet', {
        titreDemarcheId: this.etape.titreDemarcheId,
        id: this.etape.id,
        date: this.date
      })

      if (!this.etape.date) {
        this.etape.date = this.date
      }
    },

    async save() {
      if (this.complete) {
        const etape = etapeSaveFormat(this.etape)

        if (!this.etape.contenu) {
          delete this.etape.contenu
        }

        if (this.creation) {
          await this.$store.dispatch('titreEtape/add', etape)
        } else {
          await this.$store.dispatch('titreEtape/update', etape)
        }

        this.eventTrack({
          categorie: 'titre-sections',
          action: 'titre-etape-enregistrer',
          nom: etape.id
        })
      }
    },

    cancel() {
      this.errorsRemove()
      this.$store.commit('popupClose')
    },

    keyUp(e) {
      if ((e.which || e.keyCode) === 27) {
        this.cancel()
      } else if ((e.which || e.keyCode) === 13 && this.events.saveKeyUp) {
        if (this.etape.date && this.complete) {
          this.save()
        } else if (!this.etape.date && this.date) {
          this.metasGet()
        }
      }
    },

    typeUpdate() {
      if (this.etapesStatuts.length === 1) {
        this.etape.statutId = this.etapesStatuts[0].id
      } else {
        this.etape.statutId = null
      }
    },

    eventTrack(event) {
      if (this.$matomo) {
        this.$matomo.trackEvent(event.categorie, event.action, event.nom)
      }
    },

    errorsRemove() {
      // this.$store.commit('utilisateur/loginMessagesRemove')
    }
  }
}
</script>
