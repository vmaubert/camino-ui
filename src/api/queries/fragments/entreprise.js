import gql from 'graphql-tag'

const fragmentEntreprise = gql`
  fragment entreprise on Entreprise {
    id
    nom
    paysId
    legalSiren
    legalEtranger
    legalForme
    adresse
    codePostal
    commune
    cedex
    url
    telephone
    email
    etablissements {
      id
      nom
      dateDebut
      dateFin
      legalSiret
    }
    utilisateurs {
      id
      email
      nom
      prenom
    }
  }
`

export default fragmentEntreprise
