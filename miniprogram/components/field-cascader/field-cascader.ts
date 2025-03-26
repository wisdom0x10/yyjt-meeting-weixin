interface TreeNode {
  id: string
  children?: TreeNode[]
}

interface NodeContext {
  path: number[]
  parent: TreeNode | null
  siblings: TreeNode[]
}

Component({
  properties: {
    label: String,
    placeholder: { type: String, value: '' },
    options: { type: Array, default: [] },
    value: Number,
    fieldNames: { type: Object, default: { text: 'text', value: 'value', children: 'children' } }
  },
  observers: {
    'value,options': function (value, options) {
      const paths = this.findNodePathInForest(options, value)
      if (paths && paths.length) {
        this.setData({ fieldValue: paths[paths.length - 1].fullName })
      } else {
        this.setData({ fieldValue: undefined })
      }
    }
  },
  data: {
    show: false,
    fieldValue: '',

    lastValue: undefined
  },
  methods: {
    findNodePathInForest(forest: TreeNode[], targetId: string): TreeNode[] | null {
      function helper(nodes: TreeNode[], targetId: string, path: TreeNode[]): TreeNode[] | null {
        for (const node of nodes) {
          const currentPath = [...path, node]

          if (node.id === targetId) {
            return currentPath
          }

          if (node.children) {
            const result = helper(node.children, targetId, currentPath)
            if (result) {
              return result
            }
          }
        }

        return null
      }

      return helper(forest, targetId, [])
    },
    handleClick() {
      this.setData({ show: true })
    },
    handleClose() {
      this.setData({ show: false, lastValue: undefined })
    },
    handleCancel() {
      this.setData({ show: false, lastValue: undefined })
    },
    handleChange(event: any) {
      this.setData({ lastValue: event.detail.value })
    },
    handleConfirm() {
      this.triggerEvent('change', this.data.lastValue)
      this.setData({ show: false, lastValue: undefined })
    }
  }
})
