using System.Web;
using System.Web.Mvc;

namespace aspnet_mvc_webpack_proxy_assets
{
    public class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new HandleErrorAttribute());
        }
    }
}
