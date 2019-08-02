/*******************************************************************************
* Licensed Materials - Property of IBM
* (c) Copyright IBM Corporation 2019. All Rights Reserved.
*
* Note to U.S. Government Users Restricted Rights:
* Use, duplication or disclosure restricted by GSA ADP Schedule
* Contract with IBM Corp.
*******************************************************************************/

// Hack to workaround build issues with Carbon dependencies
Object.defineProperty(window, 'navigator', { value: { userAgent: 'node' }, writable: true })
Object.defineProperty(document, 'getElementById', { value: (val: String) => document.querySelector('#' + val), writable: true })

import * as React from 'react'
import * as lodash from 'lodash'
import * as PropTypes from 'prop-types'
import tableDefinitions from '../definitions/search-definitions'

import { Pagination, DataTable, OverflowMenu, OverflowMenuItem, Modal } from 'carbon-components-react'
import { TableProps, TableState } from '../model/ResourceTable'
import repl = require('@kui-shell/core/core/repl')

const { Table, TableHead, TableRow, TableBody, TableCell } = DataTable
const PAGE_SIZES = { DEFAULT: 10, VALUES: [5, 10, 20, 50, 75, 100] }

export default class ResourceTable extends React.PureComponent<TableProps, TableState> {
  static propTypes = {
    collapseTable: PropTypes.bool,
    expandFullPage: PropTypes.bool,
    items: PropTypes.array,
    kind: PropTypes.string,
  }

  constructor(props){
    super(props)
    this.state = {
      page: 1,
      pageSize: PAGE_SIZES.DEFAULT,
      sortDirection: 'asc',
      selectedKey: '',
      modalOpen: false,
      collapse: false,
    }

    this.getHeaders = this.getHeaders.bind(this)
    this.getRows = this.getRows.bind(this)
  }

  componentWillReceiveProps(nextProps) {
  this.setState({
    collapse: nextProps.collapseTable
  })
}

toggleCollapseTable = () => {
  this.setState(({collapse}) => {
    return { collapse: !collapse }
  })
}

  getHeaders() {
    const { kind } = this.props
    const resource = tableDefinitions[kind] || tableDefinitions['genericresource']
    const headers = resource.columns.map(col => ({
    key: col.key, header: col.key
  }))
  headers.push({ key: 'action', header: ''})
  return headers
  }

  getRows(){
    const { page, pageSize, selectedKey, sortDirection } = this.state
    let { items } = this.props
    const { kind } = this.props

    if (selectedKey) {
    items = lodash.orderBy(items, [selectedKey], [sortDirection])
    }
    const startItem = (page - 1) * pageSize
    const visibleItems = items.slice(startItem, startItem + pageSize)
    return visibleItems.map((item, i) => {
      const action ='table.actions.remove'
      const row = { id: i.toString(), action: null, ...item }
      const resource = tableDefinitions[kind] || tableDefinitions['genericresource']

      row.action = (
        <OverflowMenu floatingMenu flipped iconDescription={'Menu'} ariaLabel='Overflow-menu'>
          <OverflowMenuItem
            data-table-action={action}
            isDelete={true}
            onClick={() => this.setState({ modalOpen: true })}
            key={action}
            itemText={'Delete'} />
        </OverflowMenu>
      )
      return row
    })
  }

  handleSort = (selectedKey) => () => {
    if (selectedKey) {
      this.setState(preState => {
        return {selectedKey: selectedKey, sortDirection: preState.sortDirection === 'asc' ? 'desc' : 'asc' }
      })
    }
  }

  render() {
    const { page, pageSize, sortDirection, selectedKey, modalOpen, collapse } = this.state
    const totalItems = this.props.items.length
    const sortColumn = selectedKey

    return (
      <React.Fragment>
        <div className={'search--resource-table-header'}>
          { // !this.props.related ?
            <div>
              <button
                onClick={this.toggleCollapseTable}
                className={'search--resource-table-header-button'}>
                {`${this.props.kind} (${this.props.items.length})`}
              </button>
            </div>
          }
      </div>
      {!collapse
      ? <React.Fragment>
        <DataTable
          key={`${this.props.kind}-resource-table`}
          rows={this.getRows()}
          headers={this.getHeaders()}
          render={({ rows, headers }) => {
            return (
              <Table>
                <TableHead>
                  <TableRow>
                    {headers.map(header => (
                      <th scope={'col'} key={header.key}>
                        {header.key !== 'action'
                          ? <button
                              onClick={this.handleSort(header.key)}
                              className={`bx--table-sort-v2${sortDirection === 'asc' ? ' bx--table-sort-v2--ascending' : ''}${sortColumn === header.key ? ' bx--table-sort-v2--active' : ''}`}
                              data-key={header.key} >
                              <span className='bx--table-header-label'>{header.header}</span>
                            </button>
                          : null
                        }
                      </th>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map(row => (
                    <TableRow key={row.id} className='bx--data-table--compact'>
                      {row.cells.map(cell => <TableCell key={cell.id} onClick={() => {
                        var _ = row.cells.filter(data => data.info.header === 'namespace')
                        if(cell.info['header'] === 'name' && _.length > 0 && _[0].value){
                          return repl.pexec(`search summary kind:${this.props.kind} name:${cell.value} namespace:${row.cells[1].value}`)
                        }
                        else{
                          return repl.pexec(`search summary kind:${this.props.kind} name:${cell.value}`)
                        }
                      }}>{cell.value}</TableCell>)}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          }
        />
         <Pagination
          className='bx--pagination-search'
          key='resource-table-pagination'
          id='resource-table-pagination'
          onChange={(pagination) => this.setState(pagination)}
          pageSize={pageSize}
          pageSizes={PAGE_SIZES.VALUES}
          totalItems={totalItems}
          page={page}
          disabled={pageSize >= totalItems}
          isLastPage={pageSize >= totalItems}
          pageInputDisabled={pageSize >= totalItems}
        />
        </React.Fragment>
        : null }
      </React.Fragment>
    )
  }
}

