import {
  dateFormat,
  textNumberFormat,
  textToNumberFormat,
  permissionsCheck,
  jsonTypenameOmit,
  elementsFormat
} from './index'

// dateFormat
describe('dateFormat', () => {
  const cases = [
    ['2020-01-01', '01/01/2020'],
    ['2020-11-16', '16/11/2020']
  ]

  test.each(cases)('formate la date %s en %s', (input, output) => {
    expect(dateFormat(input)).toEqual(output)
  })
})

// textNumberFormat et textToNumberFormat
describe('textNumberFormat et textToNumberFormat', () => {
  const cases = [
    ['1.2 34', { negative: false, integer: false }, '1,234', 1.234],
    ['-1.234', { negative: false, integer: false }, '1,234', 1.234],
    ['-1.234', { negative: true, integer: false }, '-1,234', -1.234],
    ['---1.234', { negative: true, integer: false }, '-1,234', -1.234],
    ['1.2 34', { negative: false, integer: true }, '1', 1],
    ['---1.2 34', { negative: false, integer: true }, '1', 1],
    ['1.2abc34', { negative: false, integer: false }, '1,234', 1.234],
    ['-1.2abc34', { negative: true, integer: false }, '-1,234', -1.234],
    ['-1.2abc34', { negative: false, integer: true }, '1', 1],
    ['-1.2abc34', { negative: true, integer: true }, '-1', -1],
    ['---1.2 34', { negative: true, integer: true }, '-1', -1],
    ['1.2abc.34', { negative: false, integer: false }, '1,234', 1.234],
    ['1,2ab c.,34', { negative: false, integer: false }, '1,234', 1.234],
    ['-1,2ab c.,34', { negative: false, integer: false }, '1,234', 1.234],
    ['-1,2ab c.,34', { negative: true, integer: false }, '-1,234', -1.234],
    ['-1,2ab c.,34', { negative: true, integer: true }, '-1', -1],
    ['azerty', { negative: true, integer: true }, '', undefined]
  ]

  test.each(cases)(
    'formate %s avec les options %o en texte %s',
    (input, options, resText, resNumber) => {
      expect(textNumberFormat(input, options)).toEqual(resText)
    }
  )

  test.each(cases)(
    'formate %s avec les options %o en nombre %i',
    (input, options, resText, resNumber) => {
      expect(textToNumberFormat(resText)).toEqual(resNumber)
    }
  )
})

// permissionsCheck
describe('permissionsCheck', () => {
  const cases = [
    [
      { id: 'admin' },
      ['admin', 'defaut', 'editeur', 'entreprise', 'lecteur', 'super'],
      true
    ],
    [{ id: 'super' }, ['admin', 'super'], true]
  ]

  test.each(cases)(
    'vérifie que %o appartient à la liste des permissions %o',
    (userPermissionId, permissions, res) => {
      expect(permissionsCheck(userPermissionId, permissions)).toBe(res)
    }
  )
})

describe('jsonTypenameOmit', () => {
  test(`transforme un json en occultant les propriétés __typename`, () =>
    expect(
      jsonTypenameOmit({ id: 'id', value: 'value', __typename: 'typename' })
    ).toEqual({ id: 'id', value: 'value', __typename: undefined }))
})

describe('elementsFormat', () => {
  const metas = {
    domaines: {
      c: 'carrières',
      f: 'combustibles fossiles',
      g: 'géothermie',
      h: 'hydrocarbures liquides ou gazeux',
      i: 'inconnu',
      m: 'minéraux et métaux',
      r: 'éléments radioactifs',
      s: 'stockages souterrains',
      w: 'granulats marins'
    },
    statuts: {},
    types: {}
  }

  const cases = [
    ['domaines', 'domainesIds'],
    ['statuts', 'statutsIds'],
    ['types', 'typesIds']
  ]

  test.each(cases)('formate les %s', (nom, id) => {
    expect(elementsFormat(id, metas)).toEqual(metas[nom])
  })
})
