import { AppState } from 'store/types';
import { isEqual } from 'utils/mydash/isEqual';
import { BlockConstructable } from './Block';
import { StoreEvent } from './Store';

export function connect<P>(Component: BlockConstructable<P>, mapStateToProps: (state: AppState) => PlainObject) {
  return class extends Component {
    private partialState: PlainObject;

    constructor(props: P) {
      const state = mapStateToProps(window.store.getState());

      super({ ...props, ...state });

      this.partialState = state;
    }

    private handleStoreChange = () => {
      const newState = mapStateToProps(window.store.getState());

      if (!isEqual(this.partialState, newState)) {
        this.setProps({ ...newState });
        this.partialState = newState;
      }
    };

    componentDidMount() {
      super.componentDidMount();
      window.store.on(StoreEvent.UPDATED, this.handleStoreChange);
    }

    componentWillUnmount(): void {
      super.componentWillUnmount();
      window.store.off(StoreEvent.UPDATED, this.handleStoreChange);
    }
  };
}
