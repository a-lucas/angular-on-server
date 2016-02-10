export default function () {
    return {
        $get: function ($log) {
            return function (exception, cause) {
                var parts = [exception.stack];
                if (cause) {
                    parts.push('\nCaused by: ');
                    parts.push(cause);
                }
                $log.error(parts.join(''));
            };
        }
    };
}