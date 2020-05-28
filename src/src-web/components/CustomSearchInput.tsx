/*
 * Copyright 2020 IBM Corporation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as React from 'react'
import {
  InputProvider,
  InputProviderProps,
  InputProviderState,
  defaultOnKeyDown,
  defaultOnKeyPress,
  defaultOnKeyUp
} from '@kui-shell/plugin-client-common'
import { getCurrentTab } from '@kui-shell/core'
import SearchInput from './SearchInput'
import { injectOurCSS } from '../util/injectOurCSS'

// import '../web/scss/CustomInput.scss'

/** subclass State */
interface SearchState extends InputProviderState {
  inputText: string,
  isSearch: boolean,
  prompt: any
}

export default class CustomSearchInput extends InputProvider<SearchState> {
  public constructor(props: InputProviderProps) {
    super(props)

    this.state = Object.assign(this.state || {}, {
      inputText: '',
      isSearch: false,
      prompt:{}
    })
  }

  componentDidMount() {
    injectOurCSS()
  }

  toggleIsSearchState(inputText) {
    // If in i-search mode - set reverseSearch to the full string
    if (inputText.startsWith('search ') && !this.state.isSearch) {
      this.setState({ isSearch: true, inputText /*, reverseSearch: '' */})
    } else if (!inputText.startsWith('search') && this.state.isSearch) {
      this.setState({ isSearch: false, inputText /*, reverseSearch: '' */})
    } else {
      this.setState({ inputText /*, reverseSearch: '' */})
    }
  }

  handleInputTextChange = (e) => {
    if (e.target.value === 'search '){
    this.setState({inputText:e.target.value, isSearch:true})
    }
  }

  handleSearchTextChange = (currentQuery) => {
    const query = currentQuery.replace(/:\s*/, ':')
    this.toggleIsSearchState(query)
  }

  onKeyDown = async (e) => {
    const { inputText, isSearch } = this.state
    e.persist()
    if (e.which === 13) {
      this.setState({ isSearch: false, inputText: e.target.value})
      // If user tries to run a i-search we need to set inputText to the reverse search
      if (isSearch) {

        // grab any 'keyword/loose' text that has not been added to the official search string as a tag - we still need to run the command with this
        const unfinishedText = document.querySelector('.kui--input-stripe .repl-block input')['value']
        const searchCommand = (inputText.endsWith(':') || inputText.endsWith(' ')) ? inputText + unfinishedText : inputText + ' ' + unfinishedText
        
        if (searchCommand.trim() === 'search') {
            await getCurrentTab().REPL.pexec('search -h')
        } else {
            console.log('searchCommand',searchCommand)
            await getCurrentTab().REPL.pexec(searchCommand)
        }
      }
    }
  }


  /** This is the "input" that client provides */
  protected input() {
    return (
      <input
        autoFocus
        autoCorrect="off"
        autoComplete="off"
        spellCheck="false"
        autoCapitalize="off"
        key={this.props.idx}
        className="repl-input-element"
        onChange={this.handleInputTextChange}
        onKeyPress={defaultOnKeyPress.bind(this)}
        onKeyDown={defaultOnKeyDown.bind(this)}
        onKeyUp={defaultOnKeyUp.bind(this)}
        ref={prompt => {
          if (prompt) {
            prompt.focus()
            this.setState({ prompt })
          }
        }}
      />
    )
  }

  renderSearchComponents() {
      console.log(this.state.inputText)
    return (
      <SearchInput
        onChange={this.handleSearchTextChange}
        value={this.state.inputText}
        ref={prompt => {
            if (prompt) {
              // prompt.focus()
              this.setState({ prompt })
            }
          }}
        onKeyPress={defaultOnKeyPress.bind(this)}
        // onKeyDown={this.onKeyDown}
      />
    )
  }

  render(){
      return(
        (this.state.isSearch)
        ? this.renderSearchComponents()
        : this.input()
      )
    }
}