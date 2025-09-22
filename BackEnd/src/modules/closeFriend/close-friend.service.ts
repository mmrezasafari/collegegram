import { ICloseFriendRepository } from "./close-friend.repository";


export class CloseFriendService {
    constructor(
        private closeFriendRepo: ICloseFriendRepository,
    ) { }
}