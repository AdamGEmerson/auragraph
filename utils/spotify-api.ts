import {IHandleErrors, SdkOptions, SpotifyApi,} from "@spotify/web-api-ts-sdk";
import getConfig from "next/config";

const { serverRuntimeConfig } = getConfig();

export default class MyErrorHandler implements IHandleErrors {
  public async handleErrors(error: any): Promise<boolean> {
    return false;
  }
}


const opts: SdkOptions = {
  errorHandler: new MyErrorHandler(),
}

export const spotifyApi = SpotifyApi.withClientCredentials(serverRuntimeConfig.clientId, serverRuntimeConfig.clientSecret, [], opts);
