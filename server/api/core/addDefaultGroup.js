import { Shops, Groups } from "/lib/collections";
import { Reaction, Logger } from "/server/api";

export function addDefaultGroup(options = {}) {
  const { shopId, permissions, name } = options;
  const allGroups = Groups.find().fetch();
  const query = {};

  if (shopId) {
    query._id = shopId;
  }

  const shops = Shops.find(query).fetch();

  if (!shops.length) {
    return false;
  }

  if (shops && shops.length) {
    return shops.forEach(shop => createGroupsForShop(shop));
  }
  function createGroupsForShop(shop) {
    const groupExists = allGroups.find(grp => grp.slug === Reaction.getSlug(name) && grp.shopId === shop._id);
    if (!groupExists) {
      // create group only if it doesn't exist before
      Logger.debug(`creating group "${name}"" for shop "${shop.name}"`);
      Groups.insert({
        name,
        permissions,
        slug: Reaction.getSlug(name),
        shopId: shop._id
      });
    }
  }
}
