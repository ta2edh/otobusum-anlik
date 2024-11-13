/* eslint-disable @stylistic/no-tabs */
export const getBody = (key: string, outerKey: string, content: string) => `
<soap:Envelope
	xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
	<soap:Body>
		<${outerKey}
			xmlns="http://tempuri.org/">
			<${key}>${content}</${key}>
		</${outerKey}>
	</soap:Body>
</soap:Envelope>
`
