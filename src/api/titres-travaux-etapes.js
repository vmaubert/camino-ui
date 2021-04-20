import gql from 'graphql-tag'
import { apiGraphQLFetch } from './_client'

import { fragmentTitre } from './fragments/titre'
import { fragmentTravauxEtapeType } from './fragments/metas-travaux'

const titreTravauxEtapeMetas = apiGraphQLFetch(
  gql`
    query MetasTravauxEtape($titreTravauxId: ID!) {
      travauxEtapesTypes(titreTravauxId: $titreTravauxId) {
        ...travauxEtapeType
      }
    }

    ${fragmentTravauxEtapeType}
  `
)

const travauxEtapeCreer = apiGraphQLFetch(gql`
  mutation TravauxEtapeCreer($etape: InputTravauxEtapeCreation!) {
    travauxEtapeCreer(etape: $etape) {
      ...titre
    }
  }

  ${fragmentTitre}
`)

const travauxEtapeModifier = apiGraphQLFetch(gql`
  mutation TravauxEtapeModifier($etape: InputTravauxEtapeModification!) {
    travauxEtapeModifier(etape: $etape) {
      ...titre
    }
  }

  ${fragmentTitre}
`)

const travauxEtapeSupprimer = apiGraphQLFetch(gql`
  mutation TravauxEtapeSupprimer($id: ID!) {
    travauxEtapeSupprimer(id: $id) {
      ...titre
    }
  }

  ${fragmentTitre}
`)

export {
  titreTravauxEtapeMetas,
  travauxEtapeCreer,
  travauxEtapeModifier,
  travauxEtapeSupprimer
}
