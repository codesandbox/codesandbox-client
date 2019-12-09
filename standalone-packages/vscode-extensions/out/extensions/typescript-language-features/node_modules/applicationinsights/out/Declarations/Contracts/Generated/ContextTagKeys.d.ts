declare class ContextTagKeys {
    /**
     * Application version. Information in the application context fields is always about the application that is sending the telemetry.
     */
    applicationVersion: string;
    /**
     * Unique client device id. Computer name in most cases.
     */
    deviceId: string;
    /**
     * Device locale using <language>-<REGION> pattern, following RFC 5646. Example 'en-US'.
     */
    deviceLocale: string;
    /**
     * Model of the device the end user of the application is using. Used for client scenarios. If this field is empty then it is derived from the user agent.
     */
    deviceModel: string;
    /**
     * Client device OEM name taken from the browser.
     */
    deviceOEMName: string;
    /**
     * Operating system name and version of the device the end user of the application is using. If this field is empty then it is derived from the user agent. Example 'Windows 10 Pro 10.0.10586.0'
     */
    deviceOSVersion: string;
    /**
     * The type of the device the end user of the application is using. Used primarily to distinguish JavaScript telemetry from server side telemetry. Examples: 'PC', 'Phone', 'Browser'. 'PC' is the default value.
     */
    deviceType: string;
    /**
     * The IP address of the client device. IPv4 and IPv6 are supported. Information in the location context fields is always about the end user. When telemetry is sent from a service, the location context is about the user that initiated the operation in the service.
     */
    locationIp: string;
    /**
     * A unique identifier for the operation instance. The operation.id is created by either a request or a page view. All other telemetry sets this to the value for the containing request or page view. Operation.id is used for finding all the telemetry items for a specific operation instance.
     */
    operationId: string;
    /**
     * The name (group) of the operation. The operation.name is created by either a request or a page view. All other telemetry items set this to the value for the containing request or page view. Operation.name is used for finding all the telemetry items for a group of operations (i.e. 'GET Home/Index').
     */
    operationName: string;
    /**
     * The unique identifier of the telemetry item's immediate parent.
     */
    operationParentId: string;
    /**
     * Name of synthetic source. Some telemetry from the application may represent a synthetic traffic. It may be web crawler indexing the web site, site availability tests or traces from diagnostic libraries like Application Insights SDK itself.
     */
    operationSyntheticSource: string;
    /**
     * The correlation vector is a light weight vector clock which can be used to identify and order related events across clients and services.
     */
    operationCorrelationVector: string;
    /**
     * Session ID - the instance of the user's interaction with the app. Information in the session context fields is always about the end user. When telemetry is sent from a service, the session context is about the user that initiated the operation in the service.
     */
    sessionId: string;
    /**
     * Boolean value indicating whether the session identified by ai.session.id is first for the user or not.
     */
    sessionIsFirst: string;
    /**
     * In multi-tenant applications this is the account ID or name which the user is acting with. Examples may be subscription ID for Azure portal or blog name blogging platform.
     */
    userAccountId: string;
    /**
     * Anonymous user id. Represents the end user of the application. When telemetry is sent from a service, the user context is about the user that initiated the operation in the service.
     */
    userId: string;
    /**
     * Authenticated user id. The opposite of ai.user.id, this represents the user with a friendly name. Since it's PII information it is not collected by default by most SDKs.
     */
    userAuthUserId: string;
    /**
     * Name of the role the application is a part of. For Azure environment, this should be initialized with
     * [Microsoft.WindowsAzure.ServiceRuntime.RoleEnvironment]::CurrentRoleInstance.Role.Name
     * See more details here: https://dzone.com/articles/accessing-azure-role-0
     * It is recommended that you initialize environment variable with this value during machine startup, and then set context field from environment variable
     * appInsights.client.context.tags[appInsights.client.context.keys.cloudRole] = process.env.RoleName
     */
    cloudRole: string;
    /**
     * Name of the instance where the application is running. For Azure environment, this should be initialized with
     * [Microsoft.WindowsAzure.ServiceRuntime.RoleEnvironment]::CurrentRoleInstance.Id
     * See more details here: https://dzone.com/articles/accessing-azure-role-0
     * It is recommended that you initialize environment variable with this value during machine startup, and then set context field from environment variable
     * appInsights.client.context.tags[appInsights.client.context.keys.cloudRoleInstance] = process.env.RoleInstanceId
     */
    cloudRoleInstance: string;
    /**
     * SDK version. See https://github.com/Microsoft/ApplicationInsights-Home/blob/master/SDK-AUTHORING.md#sdk-version-specification for information.
     */
    internalSdkVersion: string;
    /**
     * Agent version. Used to indicate the version of StatusMonitor installed on the computer if it is used for data collection.
     */
    internalAgentVersion: string;
    /**
     * This is the node name used for billing purposes. Use it to override the standard detection of nodes.
     */
    internalNodeName: string;
    constructor();
}
export = ContextTagKeys;
