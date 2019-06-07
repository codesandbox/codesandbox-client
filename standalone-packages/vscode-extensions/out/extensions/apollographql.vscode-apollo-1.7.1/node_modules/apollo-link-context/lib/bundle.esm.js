import { __rest } from 'tslib';
import { ApolloLink, Observable } from 'apollo-link';

function setContext(setter) {
    return new ApolloLink(function (operation, forward) {
        var request = __rest(operation, []);
        return new Observable(function (observer) {
            var handle;
            Promise.resolve(request)
                .then(function (req) { return setter(req, operation.getContext()); })
                .then(operation.setContext)
                .then(function () {
                handle = forward(operation).subscribe({
                    next: observer.next.bind(observer),
                    error: observer.error.bind(observer),
                    complete: observer.complete.bind(observer),
                });
            })
                .catch(observer.error.bind(observer));
            return function () {
                if (handle)
                    handle.unsubscribe();
            };
        });
    });
}

export { setContext };
//# sourceMappingURL=bundle.esm.js.map
