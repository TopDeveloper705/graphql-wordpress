export default class QuerySubscription {
  fetchPromise = null;
  selectionReference = null;
  pendingRequest = null;
  rootSubscription = null;

  readyState = {
    error: null,
    props: null,
    retry: null,
  };

  listeners = [];

  constructor(environment, operation, cacheConfig) {
    this.environment = environment;
    this.operation = operation;
    this.cacheConfig = cacheConfig;

    this.relayContext = {
      environment: this.environment,
      variables: this.operation.variables,
    };
  }

  fetch() {
    if (!this.fetchPromise) {
      this.fetchPromise = new Promise(resolve => {
        let snapshot;

        this.selectionReference = this.retain();

        this.pendingRequest = this.environment
          .execute({
            operation: this.operation,
            cacheConfig: this.cacheConfig,
          })
          .finally(() => {
            this.pendingRequest = null;
          })
          .subscribe({
            next: () => {
              if (snapshot) {
                return;
              }

              snapshot = this.environment.lookup(this.operation.fragment);

              this.onChange(snapshot);

              this.rootSubscription = this.environment.subscribe(snapshot, this.onChange);

              resolve();
            },

            error: error => {
              this.updateReadyState({
                error,
                props: null,
                // $FIXME: Use default readyState when retrying.
                retry: this.retry,
              });

              resolve();
            },
          });
      });
    }

    return this.fetchPromise;
  }

  updateReadyState(readyState) {
    this.readyState = readyState;

    this.listeners.forEach(listener => {
      listener(readyState);
    });
  }

  onChange = snapshot => {
    this.updateReadyState({
      error: null,
      props: snapshot.data,
      retry: this.retry,
    });
  };

  subscribe(listener) {
    this.listeners.push(listener);
  }

  unsubscribe(listener) {
    this.listeners = this.listeners.filter(item => item !== listener);
  }

  retry = () => {
    this.dispose();
    this.fetch();
  };

  retain() {
    return this.environment.retain(this.operation.root);
  }

  dispose() {
    this.fetchPromise = null;

    if (this.selectionReference) {
      this.selectionReference.dispose();
    }

    if (this.pendingRequest) {
      this.pendingRequest.unsubscribe();
    }

    if (this.rootSubscription) {
      this.rootSubscription.dispose();
    }
  }
}
