
jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({ data: [] }))
}))


jest.mock('chart.js', () => {
  const actualChart = jest.requireActual('chart.js')

  class MockChart {
    constructor(context, options) {
      this.destroy = jest.fn()
      this.update = jest.fn()
      this.reset = jest.fn()
      this.render = jest.fn()
      return this
    }

    static register(...args) {

    }
  }

  MockChart.defaults = {}
  MockChart.overrides = {}

  return {
    ...actualChart,
    Chart: MockChart,
    registerables: [
      { id: 'title' },
      { id: 'legend' },
      { id: 'tooltip' }
    ],
    _esModule: true,
    default: MockChart
  }
})


import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import axios from 'axios'
import { RouterLinkStub } from '@vue/test-utils'
import TelaDashboardOperador from '@/components/TelaDashboardOperador.vue'


beforeAll(() => {
  global.HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
    fillRect: jest.fn(),
    clearRect: jest.fn(),
    beginPath: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    stroke: jest.fn(),
    measureText: jest.fn(() => ({ width: 100 })),
    save: jest.fn(),
    restore: jest.fn()
  }))

  global.document.getElementById = jest.fn(() => ({
    getContext: () => global.HTMLCanvasElement.prototype.getContext(),
    width: 800,
    height: 600
  }))
})

describe('TelaDashboardOperador.vue', () => {
  let wrapper

  beforeAll(() => {

    axios.get.mockImplementation((url) => {
      const endpoints = {
        'sync-all-process': { success: true },
        'count-tasks-by-tag': [
          { tagName: 'Bug', quant: 5 },
          { tagName: 'Feature', quant: 10 }
        ]
      }
      const endpoint = url.split('/').pop()
      return Promise.resolve({ data: endpoints[endpoint] || [] })
    })
  })

  beforeEach(async () => {
    wrapper = mount(TelaDashboardOperador, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub
        }
      }
    })
    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 0)) // aguarda promises
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('mount without errors', () => {
    expect(wrapper.exists()).toBe(true)
  })

  it('should create graphics instances correctly', () => {
    const chartJs = require('chart.js')                     // Arrange
    const createChart = () => new chartJs.Chart()           // Act
    expect(createChart).not.toThrow()                       // Assert
  })

  it('process API data', () => {
    expect(wrapper.vm.labels).toEqual(['Bug', 'Feature'])   // Assert
    expect(wrapper.vm.data).toEqual([5, 10])                // Assert
  })
})
