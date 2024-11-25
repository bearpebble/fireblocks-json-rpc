import * as dotenv from "dotenv"
dotenv.config()

import { Command, Option } from "commander"
import { version } from "../package.json"
import {
    asciiTitle,
    DEBUG_NAMESPACE,
    LINUX_DEFAULT_IPC_PATH,
    WINDOWS_DEFAULT_IPC_PATH,
    DEFAULT_ENV_VAR,
    DEFAULT_IPC_PATH,
    FIREBLOCKS_WEB3_PROVIDER_OPTION_DESC,
    DEFAULT_TX_NOTE,
    DEFAULT_PORT,
    DEFAULT_HOST,
} from "./constants"

export function createFireblocksJsonRpcCommand() {
    return new Command().usage('[options] [-- tool [argument ...]]')
        .description("A CLI for running a local Ethereum JSON-RPC server powered by Fireblocks")

        .addOption(new Option("--apiKey <key>", "Fireblocks API key").env("FIREBLOCKS_API_KEY").makeOptionMandatory())
        .addOption(new Option("--privateKey <path_or_contents>", "Fireblocks API private key").env("FIREBLOCKS_API_PRIVATE_KEY_PATH").makeOptionMandatory())
        .addOption(new Option("--chainId [chainId]", "Either chainId or rpcUrl must be provided").env("FIREBLOCKS_CHAIN_ID"))
        .addOption(new Option("--rpcUrl [rpcUrl]", "Either rpcUrl or chainId must be provided").env("FIREBLOCKS_RPC_URL"))

        .addOption(new Option("--http", "Run an HTTP server instead of using IPC").env("FIREBLOCKS_HTTP"))
        .addOption(new Option("--port [port]", "HTTP server port").default(DEFAULT_PORT).env("FIREBLOCKS_PORT"))
        .addOption(new Option("--host [host]", "HTTP server host").default(DEFAULT_HOST).env("FIREBLOCKS_HOST"))
        .addOption(new Option("--suppressHostWarning", "Suppress the warning printed when setting --host not to localhost").env("FIREBLOCKS_HOST"))
        .addOption(new Option("--assetId [assetId]", "If you are using a private/custom EVM chain, you can provide its Fireblocks assetId here"))
        .addOption(new Option("--httpPath [path]", "HTTP JSON-RPC endpoint path").default(undefined, '/${--apiKey}').env("FIREBLOCKS_HTTP_PATH"))
        .addOption(new Option("--ipcPath [path]", `IPC path to listen on, defaults to '${LINUX_DEFAULT_IPC_PATH}' on linux and macos, and '${WINDOWS_DEFAULT_IPC_PATH}' on windows`).default(DEFAULT_IPC_PATH).env("FIREBLOCKS_IPC_PATH"))
        .addOption(new Option("--env [env_var_name]", "Sets the listening address as an environment variable").default(DEFAULT_ENV_VAR).env("FIREBLOCKS_JSON_RPC_ENV_VAR"))

        .addOption(new Option("--vaultAccountIds [vaultAccountIds]", FIREBLOCKS_WEB3_PROVIDER_OPTION_DESC).env("FIREBLOCKS_VAULT_ACCOUNT_IDS"))
        .addOption(new Option("--apiBaseUrl [apiBaseUrl]", FIREBLOCKS_WEB3_PROVIDER_OPTION_DESC).env("FIREBLOCKS_API_BASE_URL"))
        .addOption(new Option("--fallbackFeeLevel [fallbackFeeLevel]", FIREBLOCKS_WEB3_PROVIDER_OPTION_DESC).env("FIREBLOCKS_FALLBACK_FEE_LEVEL"))
        .addOption(new Option("--note [note]", FIREBLOCKS_WEB3_PROVIDER_OPTION_DESC).default(DEFAULT_TX_NOTE).env("FIREBLOCKS_NOTE"))
        .addOption(new Option("--pollingInterval [pollingInterval]", FIREBLOCKS_WEB3_PROVIDER_OPTION_DESC).env("FIREBLOCKS_POLLING_INTERVAL"))
        .addOption(new Option("--oneTimeAddressesEnabled [oneTimeAddressesEnabled]", FIREBLOCKS_WEB3_PROVIDER_OPTION_DESC).env("FIREBLOCKS_ONE_TIME_ADDRESSES_ENABLED"))
        .addOption(new Option("--externalTxId [externalTxId]", FIREBLOCKS_WEB3_PROVIDER_OPTION_DESC).env("FIREBLOCKS_EXTERNAL_TX_ID"))
        .addOption(new Option("--userAgent [userAgent]", FIREBLOCKS_WEB3_PROVIDER_OPTION_DESC).env("FIREBLOCKS_USER_AGENT"))
        .addOption(new Option("--logTransactionStatusChanges [logTransactionStatusChanges]", FIREBLOCKS_WEB3_PROVIDER_OPTION_DESC).env("FIREBLOCKS_LOG_TX_STATUS_CHANGES"))

        .addOption(new Option("-q, --quiet", "Don't print anything").env("FIREBLOCKS_QUIET"))
        .addOption(new Option("-v, --verbose", `Print a lot of stuff, useful for debugging, same as setting DEBUG=${DEBUG_NAMESPACE}`).env("FIREBLOCKS_VERBOSE"))
        .addOption(new Option("-r, --raw", "Only output the listening address").env("FIREBLOCKS_VERBOSE"))

        .version(version, '--version', 'Output the version number')

        .allowExcessArguments()
        .showHelpAfterError()
        .addHelpText("before", asciiTitle)

        .addHelpText("after", `
Learn more about the Fireblocks Web3 Provider configuration options at 
https://github.com/fireblocks/fireblocks-web3-provider#fireblocksproviderconfig

Example usage:
  Basic usage:
      $ fireblocks-json-rpc --apiKey <key> --privateKey <path_or_contents> --chainId <chainId>
      $ fireblocks-json-rpc --apiKey <key> --privateKey <path_or_contents> --rpcUrl <rpcUrl>

  Using environment variables (.env file also works):
      $ FIREBLOCKS_API_KEY=<key> FIREBLOCKS_API_PRIVATE_KEY_PATH=<path_or_contents> FIREBLOCKS_CHAIN_ID=<chainId> \
        fireblocks-json-rpc

  Run another tool using "--":
      $ fireblocks-json-rpc --http -- cast estimate 0x5fe5a74b7628c43514DB077d5E112cf6593ed8D3 "increment()" --rpc-url {}
      $ fireblocks-json-rpc --http -- forge script script/NFT.s.sol:MyScript --sender "0x827226cc80020b343a8c03e44A974CEbF0336e74" --broadcast --unlocked --rpc-url {}

  Print requests and responses using --verbose:
      $ fireblocks-json-rpc --verbose --http -- cast estimate 0x5fe5a74b7628c43514DB077d5E112cf6593ed8D3 "increment()" --rpc-url {}

  Using a sandbox workspace with --apiBaseUrl:
      $ fireblocks-json-rpc --apiBaseUrl https://sandbox-api.fireblocks.io --apiKey <key> --privateKey <path_or_contents> --chainId <chainId>
`)
}
