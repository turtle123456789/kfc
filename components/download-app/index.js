import Link from "next/link";
export default function DownloadApp() {
  return (
    <div className="p-4">
      <h2 className="font-bold uppercase text-white">Download app</h2>
      <div className="flex mt-2">
        <Link
          href="#"
          className="w-[136px] h-[42px] border rounded-[6px] bg-contain mr-2 bg-[url(https://kfcvn-static.cognizantorderserv.com/images/web/logo_appstore.png)]"
        ></Link>
        <Link
          href="#"
          className="w-[136px] h-[42px] border rounded-[6px] bg-contain bg-[url(https://kfcvn-static.cognizantorderserv.com/images/web/logo_playstore.png)]"
        ></Link>
      </div>
    </div>
  );
}
