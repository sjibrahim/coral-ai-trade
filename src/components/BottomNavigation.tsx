
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const BottomNavigation = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    {
      iconBase64: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAYAAAAehFoBAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAKsSURBVHgB7ZlBbxJBGIbfWTCSVixe2lKTBuPBgzHhJ7DBP1C96Kl40aM00XMh8WpoTZp4E5NejT1qGrP8AiV60ENth5i0wklSazSWHWcXl52lsOwuSxmSPglhZrLAw8f7LbMAnDFaCMJiT0tgCg/BWIbPMv9Xq3y+jmS2jJAIR/jgXQ6ErPJRqs8RlIsXwxAfTvhAy4AwQzTj8REURF/B3M0tBCSYcENLQ2cleBftftktMKwgqVL4xJ9wO6cl/vHmEAaElKGj6Efcm7DVUGB5XpkEwoaQAhd/6UV8sHBDMzq/MBJRJ54as79wu6FeoH/njwpX8ZPC/jt/VFAoZAmzalVcVByH1LVVLqth/LIGKX4m+mA6CdgVbldWg4wwovKGrBhDu8LtGMiJ4CZGIgN5SVsDBZNB55QqClPIC7UGQobxA/JCrYEtzAjFBCAIsyZkhdjFFIXljYSu16zhZGRYcIsKyxRDMPP3CPd3XuPut21cwz5iMR0f41dRmUlj/fIt0PPzCAzrJazwSLBgFyB3att48uk5ZiOHmL7Q4nsWZq6nj3bMW67xBsXFZawt3EYwFNoZddb0SKBIPOBVffb+Keaih4jHjzuyIonjnyjtbmC5/haBiNgVHuqLY/FXHY+/bCLCn2VqujXw+LW9DVPeN61ewjH/Tffo8yYu8uwasr0q240hm99/Bd8Il0628CXVt/CN5q55H40MlrUIEAuHV/fmh8IH15tfzfvoOd3zY1J/vsMXxOkk/26NhVjhU0GHY8vgFGaoQToYFWfyR4K4RsL5biSBihP5M6fork0nH7prJOxNhkRQcSJ/JH67Vdj4zpZrI09xRR2QYZ3/iSILjBS7l04KJ7MF8yf9cWMULqmWu5d7nyXm1SX+7u7xeFRx+lTM117I5nHGGPgHdfbqSlGjToAAAAAASUVORK5CYII=",
      label: "Home",
      path: "/home",
      isCenter: false
    },
    {
      iconBase64: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAtCAYAAADV2ImkAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAQaSURBVHgB7VlPctM+FP6kdH4z/W0IJ8CcgHCDcALgBMR0YEuzIJBVkw2dlkXbLQzIPQHcIOEGvUHTG2TDMMBY4j07ShXHseWmboDhm8mMrUryp/f/qcA/1AuBGjFQqrkNtAHdog/dMUJOpdEXBnLcC8MzXAG1ET5Q6oiI7hZMmdDHh71wJ0IFSNQGfVEyITCAepsczB+1Ef4PMiIJTpOfEGMhENHvM/1p4s7TpIVD9UF5brueSbCN/k+Sok2aduxlGI7t875SwXciPAjDqbtuX71vS0gmGTjDw1fhzgB1ECY1tg3MHmBaxiHrbBqR8k6KHOuIDvsTZkT7tOyYhrzbD8MJrotwKlF9RCQ7PvNJisdfSXJZCWOBtD63hzYQJ6/Dp7vFe3qC1rudSCSXLHv8Eim2T17DB83bs0sHiYET+y5gHqIE3oQbMAqO+mYkw2+Qt8n27lJ4us3Pmsaw4FimtQ1d4FQycl6CVYez8DIJ8uIOhyCHxOk3NHaLVP0D8TFt/8T5ULgq5h6oD8Y+l9nxFjxAu+3NP0whqtfZ6RTN76YH6Ryqj/cunUq8QOKM66HUJMh223DCT2xECE/EiLv2mYkfKtXCmpDlE3TbPguIs7Kw46IfPhvDsWfj7HVVeDidCC6fzRUKFvFlvnphr6uhxloi72PmFtbEjRK+DmycMCekKvM3TjhNSHNMvudkTBcbJUxF/h6Fu/bliD5dlYwsvBJHHUhNQQ/se5qQng3K1tUvYZEfGSi+j5zXqW9CKiVsHJui50dVnCSZa/DIWX8xH18s3pt8AK5Zyvb0ICyOndKxmXGSks0XpDjRs8oszZbmNDM96fGoEDovIu5Vrb1R73cbkG6z2KWS8rhoDTuUa6NcdvYz1Rq3Sg3R2DPGdTxLjPpAiKHbcqXjnqDKa+R6tEB8vxc+z03VrHKS7vnlXERUWq600X2SqEwrwgAlxL2cLu3hFns3g8anvGKbxzKmwLbbLLJ9ljw3AcvFf1LltalzGb1NNFYiYdtsLsbKFGzXMfTjWUU2x6F61+LDIFdaiGLIYVnFt0riAvK+qEoUifNg2C+5sSlWsz/xBjUwVrvctQhvokKcaWNO+hWvltYlzlHDrp0TZvvicJWrespAsYmHWdVXRRFxvg4gp+rCg7BMF+hRliwTJWN/0Os8fbAuWUaRY/F1ABEb+OyzNcvpgUs0kWhnfZJ5mJlUlJH41L0BOojUkTDpO40HdpyuaadLYY1z+nVItAwz4jbbNaWQ85qDybLGl7ROmvljOg4in9zVbay8LEZSZ8ybV7LxsdX6b0m46Fb+j2tCt3IGAoocuBEI3ILRlZYsEeZC48bEblAZktMiX0Fhw4jNUkGfi0SYMcRjZLLPTYJDlm+NslD8VL3UuA7k/dPmr8Iv6e/0Sf67yYAAAAAASUVORK5CYII=",
      label: "Team",
      path: "/team",
      isCenter: false
    },
    {
      iconBase64: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAASRSURBVHgB7ZtdbuJWFMf/xyZSNSEtVQtBmofSFTRdQcIOErV9TlhBMisYsoLJrGDcx6ofqCsIWcHQtz7yUomPPqAGptMW+/RcAw52IMDY5gK6PykSvr449j/nnnPuOQ5gMBgMBoPBYDAYDIlD0EyuVMoN3727BPhUDo/Gww0my9kj+rXXajWhEa0C7efzRxahxkBp1nm5uaa3h7PBH90GNKFNoFyxWBp67lv1ccHUHu+hrEskC5pwPfcWi8VR5GiIV9CEFoGyxeLJo2VFeJ15tv+p+hF/dB06xzjJFj8/gQYy0ADz8IimV7c44367cwV0JyPV7GH+WAnz8B1bOfA61owWCyK2wkuL8di/MN2Fv8PLLMfE0SIQk9cLDRC+is4h8BfYAPRYEEUshvl0//DwanK4f5i/FB91EZpjeXVoQFuYFx9zO+1jxkwsK7SciKh53+58CQ1oC/PiVK5njOYwI/TbZJWhCW0C9Vt/1gneGR6sZhY9Yq+ic7thQyP/Dv7+/dnBxz8ws+Q+wT5shMqLLLvyV6dbh0a0b1YnZAt5nj7ud7obcW/6fNCWEDuTPsjnL8QOjxETjl63kH+DJWESX+XhN9u260n7q9hmfFAoOAw+xwbgl0fIej1ot2+QEDu1xNQGWKLeq2yh8BIJsaM+iKvTmXkcEt/Ni5k7Ivsd1oknGTnRsaQLpeA+2Hsp5Vyn12z2EIPkyx2Mu/tW18F6cfwKJYcqlDl3MFB1bgcx2Jkl5kcvxvfTY2xFks8PYKd8kCzvUJWAGJ8gJiZRXIARaAFbKRDXUOKfcIo1sHUCKXEkrKuWUY1/RmIJ4Ty2SiARJ+eLw+OWEaOatkha2j4T+EdJ8FQo9tCg75Zo6Xh4E4jzMJZqWWQlgdTOnYlKwZcty3E9Dx8C/4JzeTjH38bLI4ol3NA3eDF3vrIUjvgdyXtE2OpTv2fU4vYuJsdkcXOVRHYlgSTxOpcOxMnkeIihlE1XX6WBOKFBXPkWlcEZnaEZOjUSpxq5TEPmLtxvDf0OLgfLkNm3VAdLsnYfNFOcCeQvt1vfEU/mq2gVFYdEQNsXMtY+axnW6oOeFCeYJOK4eCvCVESEhnyOFs568mctR60sLdZmQXPFId/v1COjasNZU0Ih2gbix0swTdYi0BPiVMQx39C3KMuDz+uTTV0IL5aKdgmSukALxAnG/Wg0W6TxhXAtcxIrpS5LqgItK04wPBKp7Dvh0IUWh/O0SNeCvBlheI44wWm1hMQJY+SXmr5VLRHO0yLdKGbLg7r+vmlUuFogzoSxE9bWj58mVQvy8xTbf9DGsuJsGqtZENnXRG5Q1rSRabp4eqsxTua+hiYy79833I/2KsGARysllysJ1G+16tExaRxik+kJiFG4NxXFBcQWSHpRIZP1LEvLy5ZpEV8gKR9MH0vDbiP69EkRW6C9f4ZOZOgoe1io7T9/HrsntQkkUo3L5j+7kUrUJTYM1Qa/73QriEEiTjrzn1tVb6JiB0lEIBVK/TdRaf3/KpA2iYV51Rvvt7tlsqTQNRIq9WqfwWAwGAwGg8FgMGwp/wP614mVf9SOPQAAAABJRU5ErkJggg==",
      label: "Trade",
      path: "/trade",
      isCenter: true
    },
    {
      iconBase64: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAYAAAAehFoBAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAGnSURBVHgB7ZhBTsJAFIb/V7pxxxHwBt5APAFHsCPRrbIQwsq6IrhR10pGb+ANLCeQI/QIbDVhxqlhBhIx0sAro5lvw5vpC/0zvPylPxDghWwxlPIKUCkYiRCll0JcYwOiRckr9usOW7hHhArR0PfYkPiH/Y45jQm2SA162hNnG3/nSsGREdsTpxk8pNKR2AZBMDdLPjzS8AaakHGUrmg/fbtiC78EO3KF6KgvRG43fB+JhnGs11TKut2ozIfLEIES8+Mfz5eNPagL85kWC199OBvKR1jRBDq0F3weiRdbmEd609beClaoTVfthwcHN0EwN0EwN0EwN0EwN39OcAwmyiRJZRIhxhNeP+UpkwixCTb/YbN1e8skQmwj0RUnRwP50Pytr2wixCa4oM/w1hJsjZv/IVghrsNTnOBlGyKoFnZMjZTNJQptzkWcS8ygx0Z9s6hNZpXcyJFpjJ5RMQqoE6mW1kiw0OZ82mVrtyYO+oB6M2UDfpH3RHvfLtxIdISYFsFb0QB/yOeaHLSqayBHSY3oXGt9gB1ARNlMz8bviO9Sc5AIVMgn3yiBE6lF3z4AAAAASUVORK5CYII=",
      label: "Invest",
      path: "/market",
      isCenter: false
    },
    {
      iconBase64: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAYAAAAehFoBAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAQjSURBVHgB7VlNVtswEB4Z2te0mxzBPUHDCWpu0JyAmEK3IQug6QZnlZIuINv+KT0B6QkIJ2h6AtwbZFNoH0TqjB3ZihM7tsFpFnzvBSTFsj6PR6OZLwAPKBYM7ogPnFsAoiIAXmK3gjcsS/xANrj4GeLc7wf2617ShbkIO5yXnwHUJYi9HOQWwUVSrTjimQgT0RLAEVp0DwqGAYazb9ut6Hhqwh3O60jUmWdRxthQSLgwQA7HIFzIDMPEuRbeaQumSZ8i6cbUWmlud8z5SdSqOHGE5Lp/Yf3Use0R3APanCNxcY5NMxyV1UN7p6+tGw9ygacgz6T39MURXUB6dA3Gc7WWkTS5BPJcJ4twx2BsNO1dpwiyhKZt46YbV7Uh3DeipjqxhH03kBXVRz8dXHtkbRcKxoH9BkMcG6i+brT1eRM6/EtNaj5LZA9q25uwVMhv+Mfy1gf2Qo3OWJh8SHqhK4B7JVkVlgx0PVfrmqoxQ3iNiSP9AgHGZlH+mgdThD3rSqiFI6K1DJ/NginCE+squNcYumDFMEUYrWuFXxj9VXIFhYBw28u6Qt+9BejCCsIIG8JSbQwjw1XzXYXQJRgEsQ5z2wtYUQSEmWRmOCiHsKLQNp00VYvlShGXg4BwAZVDIViH/4DjHj9hkhKr2wYlOlnmhj6MeScsAZRYgaRaUFp47DsppwXcdJcYhW3DhKLAvOp6IdZAmOEU5qq2HtaCVyOAVaAARHMVCawfd63OQYD4pdohYRnGXgPSWSELtNJHwW0maBA6BzrItHEf+BTBIPpXheo5uCd0+MdKtLjEw6kVd72fk4fVDs4dqHYQJbBOG+CGGKnwVvIrDgcygFQgJFI2JvtBen7ItiJ1Ifhp624v7j5IsK513X3kFn6",
      label: "Profile",
      path: "/profile",
      isCenter: false
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-xl border-t border-gray-700">
      <div className="flex items-center justify-around py-2 px-4">
        {navItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className={cn(
              "flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all duration-300",
              item.isCenter && "relative"
            )}
          >
            {item.isCenter ? (
              <div className="w-14 h-14 bg-gradient-to-r from-teal-400 to-cyan-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 -mt-6">
                <img 
                  src={item.iconBase64} 
                  alt={item.label}
                  className="w-6 h-6 object-contain"
                />
              </div>
            ) : (
              <div className={cn(
                "w-6 h-6 mb-1 transition-colors duration-300",
                isActive(item.path) ? "opacity-100" : "opacity-60"
              )}>
                <img 
                  src={item.iconBase64} 
                  alt={item.label}
                  className={cn(
                    "w-full h-full object-contain transition-all duration-300",
                    isActive(item.path) ? "brightness-0 invert sepia saturate-[500%] hue-rotate-[140deg]" : ""
                  )}
                />
              </div>
            )}
            <span className={cn(
              "text-xs font-medium transition-colors duration-300",
              item.isCenter ? "text-white mt-1" : 
              isActive(item.path) ? "text-teal-400" : "text-gray-400"
            )}>
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BottomNavigation;
